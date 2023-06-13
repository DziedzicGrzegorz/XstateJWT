import type {Router} from 'express';
import {
    startSession,
    getSessionHandler,
    deleteSessionHandler,
    registration
} from '../../../controllers/session.controller';

import {noRequireUser, requireUser} from '../../../middleware/requireUser';

export const jwtRoutes = (router: Router) => {
    router
        .get('/login', requireUser, getSessionHandler)
        .post('/login', noRequireUser, startSession)
        .post('/singup', registration)
        .delete('/login', requireUser, deleteSessionHandler)

}
