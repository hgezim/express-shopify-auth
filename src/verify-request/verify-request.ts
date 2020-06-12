// import { loginAgainIfDifferentShop } from './login-again-if-different-shop';
import { verifyToken } from './verify-token';
import { Options, Routes } from './types';
import { compose } from "compose-middleware";
import { loginAgainIfDifferentShop } from './login-again-if-different-shop';


export default function verifyRequest(givenOptions: Options = {}) {
  const routes: Routes = {
    authRoute: '/auth',
    fallbackRoute: '/auth',
    ...givenOptions,
  };

  return compose([loginAgainIfDifferentShop(routes), verifyToken(routes)])
}
