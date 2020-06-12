
import { OAuthStartOptions, Request } from '../types';

import Error from './errors';
import oAuthQueryString from './oauth-query-string';
import getCookieOptions from './cookie-options';

import { TOP_LEVEL_OAUTH_COOKIE_NAME } from './index';
import { Response } from 'express';

export default function createOAuthStart(
  options: OAuthStartOptions,
  callbackPath: string,
) {
  return function oAuthStart(req: Request, res: Response) {
    const { myShopifyDomain } = options;
    const { query } = req;
    const { shop } = query;

    const shopRegex = new RegExp(
      `^[a-z0-9][a-z0-9\\-]*[a-z0-9]\\.${myShopifyDomain}$`,
      'i',
    );

    if (typeof shop !== 'string') {
      res.status(400).send(Error.ShopParamNotString)
      return;
    }

    if (shop == null || !shopRegex.test(shop)) {
      res.status(400).send(Error.ShopParamMissing)
      return;
    }

    res.cookie(TOP_LEVEL_OAUTH_COOKIE_NAME, '', getCookieOptions(req));

    const formattedQueryString = oAuthQueryString(req, res, options, callbackPath);

    res.redirect(
      `https://${shop}/admin/oauth/authorize?${formattedQueryString}`,
    );
  };
}
