import { Method, Header, StatusCode } from '@shopify/network';

import { NextFunction } from '../types';
import { TEST_COOKIE_NAME, TOP_LEVEL_OAUTH_COOKIE_NAME } from '../index';

import { Routes } from './types';
import { redirectToAuth } from './utilities';
import { Response } from 'express';
import { Request } from "../types";


export function verifyToken(routes: Routes) {
  return async function verifyTokenMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { session } = req;

    if (session && session.accessToken) {
      // set expiry date to 1 hour ago to delete cookie
      res.cookie(TOP_LEVEL_OAUTH_COOKIE_NAME, 1, {
        expires: new Date(0),
        maxAge: undefined
      });
      // If a user has installed the store previously on their shop, the accessToken can be stored in session.
      // we need to check if the accessToken is valid, and the only way to do this is by hitting the api.
      const response = await fetch(
        `https://${session.shop}/admin/metafields.json`,
        {
          method: Method.Post,
          headers: {
            [Header.ContentType]: 'application/json',
            'X-Shopify-Access-Token': session.accessToken,
          },
        },
      );

      if (response.status === StatusCode.Unauthorized) {
        redirectToAuth(routes, req, res);
        return;
      }

      await next();
      return;
    }

    res.cookie(TEST_COOKIE_NAME, '1');

    redirectToAuth(routes, req, res);
  };
}
