// import { loginAgainIfDifferentShop } from './login-again-if-different-shop';
import { verifyToken } from './verify-token';
import { Options, Routes } from './types';
import { Request } from '../types';
import { Response } from 'express';

export class VerifyAuthMiddleware {
    routes: Routes;
    constructor(givenOptions: Options = {}) {
        console.log("L12 VerifyAuthMiddleware const");
        this.routes = {
            authRoute: '/auth',
            fallbackRoute: '/auth',
            ...givenOptions,
        };
    }
    use(_req: Request, _res: Response, next: () => void) {
        console.log('L20 in VerifyAuthMiddleware');

        // loginAgainIfDifferentShop(routes, next);

        verifyToken(this.routes);

        next();
    }
}
