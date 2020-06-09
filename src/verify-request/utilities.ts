import { Routes } from './types';
import { Request } from '../types';
import { Response } from 'express';

export function redirectToAuth(
  { fallbackRoute, authRoute }: Routes,
  req: Request,
  res: Response
) {
  const {
    query: { shop },
  } = req;

  const routeForRedirect =
    shop == null ? fallbackRoute : `${authRoute}?shop=${shop}`;

  res.redirect(routeForRedirect);
}

export function clearSession(req: Request) {
  req.session = null
}