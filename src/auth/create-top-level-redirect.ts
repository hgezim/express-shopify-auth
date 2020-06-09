import querystring from 'querystring';
import redirectionPage from './redirection-page';
import { Request } from '../types';
import { Response } from 'express';
import Error from "./errors";

export default function createTopLevelRedirect(apiKey: string, path: string) {
  return function topLevelRedirect(req: Request, res: Response) {
    const { hostname, query } = req;
    const { shop } = query;

    const params = { shop };
    const queryString = querystring.stringify(params);

    if (typeof shop !== 'string') {
      res.status(400).send(Error.ShopParamNotString)
      return;
    }

    res.send(redirectionPage({
      origin: shop,
      redirectTo: `https://${hostname}${path}?${queryString}`,
      apiKey,
    }));
  };
}
