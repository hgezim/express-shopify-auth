import createTopLevelRedirect from './create-top-level-redirect';
import getCookieOptions from './cookie-options';

import { TOP_LEVEL_OAUTH_COOKIE_NAME } from './index';
import { Request } from '../types';
import { Response } from 'express';

export default function createTopLevelOAuthRedirect(
  apiKey: string,
  path: string,
) {
  const redirect = createTopLevelRedirect(apiKey, path);

  return function topLevelOAuthRedirect(req: Request, res: Response) {
    res.cookie(TOP_LEVEL_OAUTH_COOKIE_NAME, '1', getCookieOptions(req));
    redirect(req, res);
  };
}
