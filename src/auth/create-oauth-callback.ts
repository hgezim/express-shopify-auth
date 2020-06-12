import querystring from 'querystring';

import { AuthConfig, Request } from '../types';

import Error from './errors';
import validateHmac from './validate-hmac';
import { Response } from 'express';

export default function createOAuthCallback(config: AuthConfig) {
  return async function oAuthCallback(req: Request, res: Response) {
    const { query, cookies } = req;
    const { code, hmac, shop, state: nonce } = query;
    const { apiKey, secret, afterAuth } = config;

    if (nonce == null || cookies['shopifyNonce'] !== nonce) {
      res.status(403).send(Error.NonceMatchFailed)
      return;
    }

    if (shop == null) {
      res.status(400).send(Error.ShopParamMissing)
      return;
    }
    if (typeof hmac !== 'string') {
      res.status(400).send(Error.InvalidHmacType)
      return;
    }

    if (validateHmac(hmac, secret, query) === false) {
      res.status(400).send(Error.InvalidHmac)
      return;
    }

    const accessTokenQuery = querystring.stringify({
      code,
      client_id: apiKey,
      client_secret: secret,
    });

    const accessTokenResponse = await fetch(
      `https://${shop}/admin/oauth/access_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(accessTokenQuery).toString(),
        },
        body: accessTokenQuery,
      },
    );

    if (!accessTokenResponse.ok) {
      res.status(401).send(Error.AccessTokenFetchFailure)
      return;
    }

    const accessTokenData = await accessTokenResponse.json();
    const { access_token: accessToken } = accessTokenData;

    if (req.session) {
      req.session.shop = shop;
      req.session.accessToken = accessToken;
    }

    // ctx.state.shopify = { TODO: implement this stuff — not sure it's used anywhere on the client so maybe it needs to be taken out....log issue with koa-shopify-auth
    //   shop,
    //   accessToken,
    // };

    if (afterAuth) {
      await afterAuth(req, res);
    }
  };
}
