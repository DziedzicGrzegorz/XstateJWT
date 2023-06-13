import {Router} from 'express'
import {jwtRoutes} from './JWT/JWT'
import {OAuthRoutes} from './OAuth/OAuth';

const router = Router();

export const loginRouter = (): Router => {
    jwtRoutes(router);
    OAuthRoutes(router);
    return router;
}

