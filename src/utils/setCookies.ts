import {Response} from 'express';

export const acccessTokenMaxAge = 1000 * 60 * 60 * 24 * 7; // 1 week
export const refreshTokenMaxAge = 1000 * 60 * 60 * 24 * 365; // 1 year
export function setCookies(res: Response, accessToken: string, refreshToken: string, accessTokenMaxAge: number, refreshTokenMaxAge: number): void {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: accessTokenMaxAge
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: refreshTokenMaxAge
    });
}

