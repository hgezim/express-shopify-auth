import { OAuthStartOptions, AccessMode, OAuthStartOptionsPrefixType } from '../types';

import createOAuthStart from './create-oauth-start';
import createOAuthCallback from './create-oauth-callback';
import createEnableCookies from './create-enable-cookies';
import createTopLevelOAuthRedirect from './create-top-level-oauth-redirect';
import createRequestStorageAccess from './create-request-storage-access';
import { Response } from 'express';
import { Request } from "../types";

const DEFAULT_MYSHOPIFY_DOMAIN = 'myshopify.com';
const DEFAULT_ACCESS_MODE: AccessMode = 'online';

export const TOP_LEVEL_OAUTH_COOKIE_NAME = 'shopifyTopLevelOAuth';
export const TEST_COOKIE_NAME = 'shopifyTestCookie';
export const GRANTED_STORAGE_ACCESS_COOKIE_NAME =
    'shopify.granted_storage_access';

function hasCookieAccess({ cookies }: Request) {
    return Boolean(cookies[TEST_COOKIE_NAME]);
}

function grantedStorageAccess({ cookies }: Request) {
    return Boolean(cookies[GRANTED_STORAGE_ACCESS_COOKIE_NAME]);
}

function shouldPerformInlineOAuth({ cookies }: Request) {
    return Boolean(cookies[TOP_LEVEL_OAUTH_COOKIE_NAME]);
}

export class ShopifyAuthMiddleware {
    config: OAuthStartOptions
    prefix: OAuthStartOptionsPrefixType
    oAuthStartPath: string;
    oAuthCallbackPath: string;
    inlineOAuthPath: string;
    enableCookiesPath: string;

    constructor(options: OAuthStartOptions) {
        console.log("L43 ShopifyAuthMiddleware const");
        const DEFAULT_PREFIX = '';
        this.config = {
            scopes: [],
            prefix: DEFAULT_PREFIX,
            myShopifyDomain: DEFAULT_MYSHOPIFY_DOMAIN,
            accessMode: DEFAULT_ACCESS_MODE,
            ...options,
        };

        this.prefix = this.config.prefix || DEFAULT_PREFIX;
        this.oAuthStartPath = `${this.prefix}/auth`;
        this.oAuthCallbackPath = `${this.oAuthStartPath}/callback`;
        this.inlineOAuthPath = `${this.prefix}/auth/inline`;
        this.enableCookiesPath = `${this.oAuthStartPath}/enable_cookies`;

    }

    private oAuthStart(req: Request, res: Response) {
        const oAuthStart = createOAuthStart(this.config, this.oAuthCallbackPath);
        oAuthStart(req, res);
    }
    private oAuthCallback(req: Request, res: Response) {
        const oAuthCallback = createOAuthCallback(this.config);
        oAuthCallback(req, res);
    }

    private topLevelOAuthRedirect(req: Request, res: Response) {
        const topLevelOAuthRedirect = createTopLevelOAuthRedirect(
            this.config.apiKey,
            this.inlineOAuthPath,
        );
        topLevelOAuthRedirect(req, res)
    }

    private enableCookies(req: Request, res: Response) {
        const enableCookies = createEnableCookies(this.config);
        enableCookies(req, res);
    }

    private requestStorageAccess(req: Request, res: Response) {
        const requestStorageAccess = createRequestStorageAccess({ ...this.config, oAuthStartPath: this.oAuthStartPath });
        requestStorageAccess(req, res);
    }


    use(req: Request, res: Response, next: () => void): void {
        // ctx.cookies.secure = true; // TODO: change this accordingly

        if (
            req.path === this.oAuthStartPath &&
            !hasCookieAccess(req) &&
            !grantedStorageAccess(req)
        ) {
            this.requestStorageAccess(req, res);
            return;
        }

        if (
            req.path === this.inlineOAuthPath ||
            (req.path === this.oAuthStartPath && shouldPerformInlineOAuth(req))
        ) {
            this.oAuthStart(req, res);
            return;
        }

        if (req.path === this.oAuthStartPath) {
            this.topLevelOAuthRedirect(req, res);
            return;
        }

        if (req.path === this.oAuthCallbackPath) {
            this.oAuthCallback(req, res);
            return;
        }

        if (req.path === this.enableCookiesPath) {
            this.enableCookies(req, res);
            return;
        }

        next();
    }
}

export { default as Error } from './errors';
export { default as validateHMAC } from './validate-hmac';
