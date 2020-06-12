import * as querystring from 'querystring';
import { OAuthStartOptions, Request } from '../types';
import nonce from 'nonce';

import getCookieOptions from './cookie-options';
import { Response } from 'express';

const createNonce = nonce();

export default function oAuthQueryString(
  req: Request,
  res: Response,
  options: OAuthStartOptions,
  callbackPath: string,
): string {
  const { hostname } = req;

  const { scopes = [], apiKey, accessMode } = options;

  const requestNonce = createNonce(); //crypto.randomBytes(16).toString('base64');
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
