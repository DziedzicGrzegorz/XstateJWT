import type {Request, Response} from 'express';
import {ValidationError} from '../utils/error';
import {createUser, getUserByEmail, invalidateSession} from '../db/allUser';
import {createAndSign} from '../utils/jwt.utils';
import {acccessTokenMaxAge, refreshTokenMaxAge, setCookies} from '../utils/setCookies';
import {hashComparison} from '../utils/passwordHash';


export async function startSession(req: Request, res: Response) {

    const {email, password} = req.body;
    if (!email || !password) {
        throw new ValidationError('Invalid email or password');
    }

    const user = getUserByEmail(email);

    if (!user) {
        throw new ValidationError('Invalid user');
    }

    if (user.Auth === 'OAuth' || user.password === undefined) {
        throw new ValidationError('You are using wrong login method');
    }

    const hashResult = await hashComparison(password, user.password);

    if (!hashResult) {
        throw new ValidationError('Invalid password');
    }

    const {session, accessToken, refreshToken} = createAndSign(user);

    setCookies(res, accessToken, refreshToken, acccessTokenMaxAge, refreshTokenMaxAge);

    res.json(session);
}


export function getSessionHandler(req: Request, res: Response) {
    res.json(req.user);
}

export function deleteSessionHandler(req: Request, res: Response) {

    setCookies(res, '', '', 0, 0);


    // in requireUser middleware we check if req.user exists, so we are confident that it exists here
    if (req.user?.sessionId) {
        const session = invalidateSession(req.user.sessionId);
        res.send(session);
    }

}

export async function registration(req: Request, res: Response) {
    const {email, password, name} = req.body as { email: string, password: string, name: string };

    if (!email || !password || !name) {
        throw new ValidationError('Invalid email or password');
    }
    let user = getUserByEmail(email);

    if (user) {
        throw new ValidationError('User already exists');
    }

    user = createUser({email, name, Auth: 'Password', password});
    const {session, accessToken, refreshToken} = createAndSign(user);


    setCookies(res, accessToken, refreshToken, acccessTokenMaxAge, refreshTokenMaxAge);

    res
        .json({message: 'User created', session})
        .status(200)

}
