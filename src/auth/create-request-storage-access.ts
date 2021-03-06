import { OAuthStartOptionsInternal, Request } from '../types';

import css from './client/polaris-css';
import itpHelper from './client/itp-helper';
import requestStorageAccess from './client/request-storage-access';
import storageAccessHelper from './client/storage-access-helper';
import Error from './errors';
import { Response } from 'express';

const HEADING = 'This app needs access to your browser data';
const BODY =
  'Your browser is blocking this app from accessing your data. To continue using this app, click Continue, then click Allow if the browser prompts you.';
const ACTION = 'Continue';

export default function createRequestStorageAccess({
  apiKey, oAuthStartPath, prefix,
}: OAuthStartOptionsInternal) {
  return function requestStorage(req: Request, res: Response) {
    const { query } = req;
    const { shop } = query;

    if (shop == null) {
      res.status(400).send(Error.ShopParamMissing)
      return;
    }
    if (typeof shop !== 'string') {
      res.status(400).send(Error.ShopParamNotString)
      return;
    }


    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <style>
    ${css}
  </style>
  <base target="_top">
  <title>Redirecting…</title>

  <script>
    window.apiKey = "${apiKey}";
    window.shopOrigin = "https://${encodeURIComponent(shop)}";
    ${itpHelper}
    ${storageAccessHelper}
    ${requestStorageAccess(shop, oAuthStartPath, prefix)}
  </script>
</head>
<body>
  <main id="RequestStorageAccess">
    <div class="Polaris-Page">
      <div class="Polaris-Page__Content">
        <div class="Polaris-Layout">
          <div class="Polaris-Layout__Section">
            <div class="Polaris-Stack Polaris-Stack--vertical">
              <div class="Polaris-Stack__Item">
                <div class="Polaris-Card">
                  <div class="Polaris-Card__Header">
                    <h1 class="Polaris-Heading">${HEADING}</h1>
                  </div>
                  <div class="Polaris-Card__Section">
                    <p>${BODY}</p>
                  </div>
                </div>
              </div>
              <div class="Polaris-Stack__Item">
                <div class="Polaris-Stack Polaris-Stack--distributionTrailing">
                  <div class="Polaris-Stack__Item">
                    <button type="button" class="Polaris-Button Polaris-Button--primary" id="TriggerAllowCookiesPrompt">
                      <span class="Polaris-Button__Content"><span>${ACTION}</span></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</body>
</html>`);
  };
}
