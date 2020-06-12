enum Error {
  ShopParamMissing = 'Expected a valid shop query parameter',
  ShopParamNotString = 'Expected a string shop query parameter but the type received is not string',

  InvalidHmac = 'HMAC validation failed',
  InvalidHmacType = 'HMAC validation failed: hmac is expected to be a string',

  AccessTokenFetchFailure = 'Could not fetch access token',
  NonceMatchFailed = 'Request origin could not be verified',
}

export default Error;
