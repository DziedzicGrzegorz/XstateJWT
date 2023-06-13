import type {Request, Response} from 'express';
import {getGoogleAuthUrl, getGoogleData} from '../utils/googleOAuth';
import {createUser, getUserByEmail} from '../db/allUser';
import {ValidationError} from '../utils/error';
import {createAndSign} from '../utils/jwt.utils';
import {acccessTokenMaxAge, refreshTokenMaxAge, setCookies} from '../utils/setCookies';

export async function startOAuthSession(req: Request, res: Response) {
    const {email} = await getGoogleData(req, 'loginGoogleOAuth');

    // Check if email exists in your database
    const user = await getUserByEmail(email);

    if (!user) {
        throw new ValidationError('Email not exist in database pls first singUp');
    }
    if (user.Auth === 'Password') {
        throw new ValidationError('You are OAuth user, login by password instead');
    }

    const {session, accessToken, refreshToken} = createAndSign(user);

    setCookies(res, accessToken, refreshToken, acccessTokenMaxAge, refreshTokenMaxAge);

    res.json(session);
}


export async function registrationOAuth(req: Request, res: Response) {
    const {email, given_name} = await getGoogleData(req, 'singUpGoogleOAuth');
    const name = given_name;

    let user = await getUserByEmail(email);

    if (user) {
        throw new ValidationError('You exist on our platform login instead');
    }


    user = createUser({email, name, Auth: 'OAuth'});

    const {session, accessToken, refreshToken} = createAndSign(user);


    setCookies(res, accessToken, refreshToken, acccessTokenMaxAge, refreshTokenMaxAge);

    res.json(session);
}

export function toLoginOAuth(req: Request, res: Response) {
    res.redirect(getGoogleAuthUrl('loginGoogleOAuth'));
}

export function toSingUpOAuth(req: Request, res: Response) {
    res.redirect(getGoogleAuthUrl('singUpGoogleOAuth'));
}