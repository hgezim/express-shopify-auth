import { NextFunction, Request } from '../types';

import { Routes } from './types';
import { Response } from "express";
import { clearSession, redirectToAuth } from './utilities';

export function loginAgainIfDifferentShop(routes: Routes) {
  return function loginAgainIfDifferentShopMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { query, session } = req;

    if (session && query.shop && session.shop !== query.shop) {
      clearSession(req);
      redirectToAuth(routes, req, res);
      return;
    }

    next();
  };
}
