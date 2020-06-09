// import { loginAgainIfDifferentShop } from './login-again-if-different-shop';
import { verifyToken } from './verify-token';
import { Options, Routes } from './types';

export default function verifyRequest(givenOptions: Options = {}) {
  const routes: Routes = {
    authRoute: '/auth',
    fallbackRoute: '/auth',
    ...givenOptions,
  };

  // loginAgainIfDifferentShop(routes)

  return verifyToken(routes);
}
