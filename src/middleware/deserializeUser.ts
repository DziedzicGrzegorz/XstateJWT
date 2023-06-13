import {getSession, sessions} from '../db/allUser';
import {signJWT, verifyJWT} from '../utils/jwt.utils';
import {assign, createMachine, interpret} from 'xstate';
import {DecodedPayload, UserPayload, UserSession} from '../types/user';
import type {Request, Response, NextFunction} from "express";

interface UserContext {
    accessToken: string | undefined;
    refreshToken: string | undefined;
    accessTokenExpired: boolean;
    payload: UserPayload | null;
    refresh: DecodedPayload | null;
    session: UserSession | null;
}


export function deserializeUser(req: Request, res: Response, next: NextFunction) {


    const userMachine = createMachine<UserContext>(
        {
            predictableActionArguments: true,
            id: 'user',
            initial: 'start',
            context: {
                accessToken: undefined,
                refreshToken: undefined,
                accessTokenExpired: false,
                payload: null,
                refresh: null,
                session: null,
            },
            states: {
                start: {
                    entry: 'onStart',
                    always: [
                        {target: 'accessTokenFound', cond: 'hasAccessToken'},
                        {target: 'accessTokenNotFound'},
                    ],
                },
                accessTokenFound: {
                    entry: 'onAccessTokenFound',
                    always: [
                        {target: 'payloadFound', cond: 'hasPayload'},
                        {target: 'accessTokenExpired', cond: 'hasExpiredAndRefreshToken'},
                        {target: 'noRefreshToken'},
                    ],
                },
                accessTokenNotFound: {
                    entry: 'onAccessTokenNotFound',
                    always: 'next',
                },
                payloadFound: {
                    entry: 'onPayloadFound',
                    always: 'next',
                },
                accessTokenExpired: {
                    entry: 'onAccessTokenExpired',
                    always: 'checkSession',
                },
                noRefreshToken: {
                    entry: 'onNoRefreshToken',
                    always: 'next',
                },
                checkSession: {
                    entry: 'onCheckSession',
                    always: [
                        {target: 'sessionFound', cond: 'hasSession'},
                        {target: 'sessionNotFound'},
                    ],
                },
                sessionFound: {
                    entry: 'onSessionFound',
                    always: 'next',
                },
                sessionNotFound: {
                    entry: 'onSessionNotFound',
                    always: 'next',
                },
                next: {
                    entry: 'onNext',
                    type: 'final',
                },
            },
        },
        {
            guards: {
                hasAccessToken: (ctx) => ctx.accessToken !== undefined,
                hasPayload: (ctx) => ctx.payload !== null,
                hasExpiredAndRefreshToken: (ctx) => ctx.refreshToken !== undefined && ctx.accessTokenExpired,
                hasSession: (ctx) => ctx.session !== null,
            },
            actions: {
                onStart: assign((ctx) => {
                    const {accessToken, refreshToken} = req.cookies;



                    return {
                        ...ctx,
                        accessToken,
                        refreshToken,
                    }
                }),
                onAccessTokenNotFound: assign(() => {
                    return {};
                }),

                onAccessTokenFound: assign((ctx) => {
                    const {payload, expired} = verifyJWT(ctx.accessToken!) as {
                        payload: UserPayload | null;
                        expired: boolean;
                    };
                    if (payload) { // payload exist only if token not expired
                        return {
                            ...ctx,
                            payload,
                        };
                    } else if (expired && ctx.refreshToken) {
                        return {
                            ...ctx,
                            accessTokenExpired: true,

                        };
                    } else {
                        return ctx;
                    }
                }),
                onPayloadFound: assign((ctx) => {
                    req.user = ctx.payload;
                    return ctx;
                }),
                onAccessTokenExpired: assign((ctx) => {
                    const {payload: refresh} = verifyJWT(ctx.refreshToken!) as {
                        payload: DecodedPayload;
                    };
                    return {
                        ...ctx,
                        refresh,
                    };
                }),
                onNoRefreshToken: assign(() => {
                    return {};
                }),
                onCheckSession: assign((ctx) => {
                    // if(sessions['1']){ // to check path when sessions is invalid
                    //     sessions['1'].valid = false;
                    // }
                    const session = ctx.refresh?.sessionId ? getSession(ctx.refresh.sessionId) : undefined;
                    if (session) {
                        return {
                            ...ctx,
                            session,
                        };
                    } else {
                        return ctx;
                    }
                }),
                onSessionFound: assign((ctx) => {
                    const newAccessToken = signJWT(ctx.session!, '5s');

                    res.cookie('accessToken', newAccessToken, {
                        maxAge: 1000 * 60 * 60 * 24 * 7,// 1 week
                        httpOnly: true,
                    });

                    req.user = verifyJWT(newAccessToken).payload;
                    return ctx;
                }),
                onSessionNotFound: assign(() => {
                    return {};
                }),
                onNext: () => {
                    next();
                },
            },
        }
    );

    interpret(userMachine).start();
}
