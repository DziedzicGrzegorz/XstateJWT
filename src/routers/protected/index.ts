import {Router} from 'express';
import {privateRoute} from './privateRouter';

const router = Router();

export const privateRouter = (): Router => {
    privateRoute(router);
    return router;
}


