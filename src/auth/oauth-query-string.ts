import * as querystring from 'querystring';
import * as crypto from 'crypto';
import { OAuthStartOptions, Request } from '../types';

import getCookieOptions from './cookie-options';
import { Response } from 'express';

export default function oAuthQueryString(
  req: Request,
  res: Response,
  options: OAuthStartOptions,
  callbackPath: string,
): string {
  const { hostname } = req;

  const { scopes = [], apiKey, accessMode } = options;

  const requestNonce = crypto.randomBytes(16).toString('base64');
  // TODO: ensure this errors out bug https://github.com/typescript-eslint/typescript-eslint/issues/2198:
  //const { cookie } = res;
  // cookie(...)
  res.cookie('shopifyNonce', requestNonce, getCookieOptions(req));

  const redirectParams: { [key: string]: string } = {
    state: requestNonce,
    scope: scopes.join(', '),
    client_id: apiKey,
    redirect_uri: `https://${hostname}${callbackPath}`,
  };

  if (accessMode === 'online') {
    redirectParams['grant_options[]'] = 'per-user';
  }

  return querystring.stringify(redirectParams);
}
