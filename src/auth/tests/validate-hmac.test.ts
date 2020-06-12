import validateHmac from '../validate-hmac';



const data = { fiz: 'buzz', foo: 'bar' };
const secret = 'some secret';
const hmac = '7c66606415117ff9744a2a9b2be1712a15928b5ef474ab1a9ff5dc36b7dcaed8';

describe('validateHmac', () => {

  it('returns true when digest matches input', () => {
    expect(validateHmac(hmac, secret, data)).toBe(true);
  });

  it('returns false when digests does not match input', () => {
    expect(validateHmac('7c66606415117fnot actually an hmac f80118274ab1a9ff5dc36b7dcaed8', secret, data)).toBe(false);
  });

  // it('compares using safeCompare', () => {
  //   validateHmac(hmac, secret, data);
  //   expect(safeCompare).toHaveBeenCalledWith(hmac, hmac);
  // });

  it('works when the query params are ordered differently', () => {
    expect(validateHmac(hmac, secret, { foo: 'bar', fiz: 'buzz' })).toBe(true);
  });
});
