import type {Router} from 'express';
import {
    registrationOAuth,
    startOAuthSession,
    toLoginOAuth,
    toSingUpOAuth
} from '../../../controllers/session.OAuth.controller';

export const OAuthRoutes = (router: Router) => {
    router
        .get('/loginOAuth', toLoginOAuth)
        .get('/singupOAuth', toSingUpOAuth)

        .get('/loginGoogleOAuth', startOAuthSession)
        .get('/singupGoogleOAuth', registrationOAuth)
}

