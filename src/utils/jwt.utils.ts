import jwt, {Secret} from 'jsonwebtoken';
import * as dotenv from 'dotenv'
import {createSession} from "../db/allUser";
import type {DecodedPayload, User, UserPayload} from "../types/user";

dotenv.config();

const privateKey = process.env.PRIVATEKEYJWT
const publicKey = process.env.PUBLICKEYJWT

export function signJWT(payload: Object, expiresIn: string | number) {
    return jwt.sign(payload, privateKey as Secret, {algorithm: 'RS256', expiresIn});
}

export function verifyJWT(token: string) {
    try {
        const decoded = jwt.verify(token, publicKey as Secret, {algorithms: ['RS256']}) as DecodedPayload | UserPayload;
        return {payload: decoded, expired: false};
    } catch (error) {
        return {payload: null, expired: (error as Error).message.includes('jwt expired')};
    }
}

export function createAndSign(user: Pick<User, "name" | "email">) {
    const {email, name} = user;
    const session = createSession(email, name)

    const {sessionId} = session;

    const accessToken = signJWT({email, name, sessionId}, '5s'); // to jest w ciastko
    const refreshToken = signJWT({sessionId}, '1y') // to jest w ciastku


    return {session, accessToken, refreshToken};
}