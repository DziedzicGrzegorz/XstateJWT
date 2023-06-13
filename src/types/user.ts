export interface DecodedPayload {
    sessionId: string;
    iat: number;
    exp: number;
}

export interface UserPayload extends DecodedPayload {
    email: string;
    valid: boolean;
    name: string;
}

export type UserSession = Omit<UserPayload, 'exp' | 'iat'>

export interface User {
    email: string,
    password?: string,
    name: string,
    Auth: 'OAuth' | 'Password'
}


export interface GoogleUser {
    given_name: string,
    family_name: string,
    email: string
}

export type beforeOAuth = "loginOAuth" | "singupOAuth";
export type afterOAuth = "loginGoogleOAuth" | "singUpGoogleOAuth";