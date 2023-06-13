import {JwtPayload} from "jsonwebtoken";

declare module "jsonwebtoken" {
    export interface JwtPayload {
        sessionId?: string;
    }
}

declare global {
    namespace Express {
        export interface Request {
            user?: JwtPayload | null;
        }
    }
}

