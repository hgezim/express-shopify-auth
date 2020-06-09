import * as querystring from 'querystring';

import { createHmac, timingSafeEqual } from 'crypto';

export default function validateHmac(
  hmac: string,
  secret: string,
  query: any,
) {
  const { hmac: _hmac, signature: _signature, ...map } = query;

  const orderedMap = Object.keys(map)
    .sort((value1, value2) => value1.localeCompare(value2))
    .reduce((accum, key) => {
      accum[key] = map[key];
      return accum;
    }, {} as any);

  const message = querystring.stringify(orderedMap);
  const generatedHash = createHmac('sha256', secret)
    .update(message)
    .digest('hex');

  return timingSafeEqual(Buffer.from(generatedHash), Buffer.from(hmac));
}
