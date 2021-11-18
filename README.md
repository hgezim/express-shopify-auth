## This repo is no longer active. Shopify now recommends cookie-less auth (token based auth).

# `express-shopify-auth`

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE.md)

Middleware to authenticate an [Express](https://expressjs.com/) application with [Shopify](https://www.shopify.ca/).

It's a port of [@shopify/koa-shopify-auth](https://github.com/Shopify/quilt/blob/master/packages/koa-shopify-auth/README.md) and a successor to [`@shopify/shopify-express`](https://www.npmjs.com/package/@shopify/shopify-express).

Features you might know from the express module like the webhook middleware and proxy will be presented as their [own packages instead](https://github.com/Shopify/quilt/blob/master/packages/koa-shopify-graphql-proxy/README.md).

## Installation

```bash
$ npm install --save hgezim-express-shopify-auth
```

## Usage

This package exposes `ShopifyAuthMiddleware` and `VerifyAuthMiddleware` as a named export.

```js
import { ShopifyAuthMiddleware, VerifyAuthMiddleware } from "express-shopify-auth";
```

### ShopifyAuthMiddleware

This is a middleware class that needs to be instantiated. By default it takes the routes `/auth` and `/auth/callback`.

```js

const shopifyAuth = new ShopifyAuthMiddleware({
  // if specified, mounts the routes off of the given path
  // eg. /shopify/auth, /shopify/auth/callback
  // defaults to ''
  prefix: '/shopify',
  // your shopify app api key
  apiKey: SHOPIFY_API_KEY,
  // your shopify app secret
  secret: SHOPIFY_SECRET,
  // scopes to request on the merchants store
  scopes: ['write_orders, write_products'],
  // set access mode, default is 'online'
  accessMode: 'offline',
  // callback for when auth is completed
  afterAuth(req, res) {
    const {shop, accessToken} = req.session;

    console.log('We did it!', accessToken);

    res.redirect('/');
  },
});

app.use(
  shopifyAuth.use.bind(shopifyAuth)
);
```

#### `/auth`

This route starts the oauth process. It expects a `?shop` parameter and will error out if one is not present. To install it in a store just go to `/auth?shop=myStoreSubdomain`.

### `/auth/callback`

You should never have to manually go here. This route is purely for shopify to send data back during the oauth process.

### VerifyAuthMiddleware

Returns a middleware to verify requests before letting them further in the chain.

```javascript

const verifyRequest = new VerifyAuthMiddleware(
  {
    // path to redirect to if verification fails
    // defaults to '/auth'
    authRoute: '/foo/auth',
    // path to redirect to if verification fails and there is no shop on the query
    // defaults to '/auth'
    fallbackRoute: '/install',
  }
);

app.use(
  verifyRequest.use.bind(verifyRequest),
);
```

### Example app

```javascript
import 'isomorphic-fetch';
import { ShopifyAuthMiddleware, VerifyAuthMiddleware } from "express-shopify-auth";
import cookieSession = require("cookie-session");


const {SHOPIFY_API_KEY, SHOPIFY_SECRET, COOKIE_SESSION_SECRET} = process.env;


const express = require('express')

const app = express()
const port = 3000

// sets up shopify auth
const shopifyAuth = new ShopifyAuthMiddleware({
  apiKey: SHOPIFY_API_KEY,
  secret: SHOPIFY_SECRET,
  scopes: ['write_orders, write_products'],
  afterAuth: async (req, res) => {
    const {shop, accessToken} = req.session;

    console.log('We did it!', accessToken);

    res.redirect('/');
  }
});

const verifyRequest = new VerifyAuthMiddleware()

  // sets up secure session data on each request
app.use(cookieSession({ secure: true, sameSite: 'none', secret: COOKIE_SESSION_SECRET }))
  // bind instance of ShopifyAuthMiddleware
  .use(shopifyAuth.use.bind(shopifyAuth))
  // bind instance of VerifyAuthMiddleware
  .use(verifyRequest.use.bind(verifyRequest))
  // application code
  .use((req, res, next) => {
    res.send('🎉')
  })
;

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

```

## Contrib

You can import this module locally from a node project using:

`npm install --save <path to local dir of this module>`

Then run `npm run dev` to watch this directory and build any changes.

To release a new version use [release](https://www.npmjs.com/package/release):

`release <type>`

## Gotchas

### Fetch

This app uses `fetch` to make requests against shopify, and expects you to have it polyfilled. The example app code above imports `isomorphic-fetch`.

### Session

Though you can use `ShopifyAuthMiddleware` without a session middleware configured, `VerifyAuthMiddleware` expects you to have one. If you don't want to use one and have some other solution to persist your credentials, you'll need to build your own verification function.

### Testing locally

By default this app requires that you use a `myshopify.com` host in the `shop` parameter. You can modify this to test against a local/staging environment via the `myShopifyDomain` option to `shopifyAuth` (e.g. `myshopify.io`).
