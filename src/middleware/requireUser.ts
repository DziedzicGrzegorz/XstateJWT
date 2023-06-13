import {NextFunction, Request, Response} from 'express';

export function requireUser(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(403).send('You are unauthorized');
    }

    return next();
}
export function noRequireUser(req: Request, res: Response, next: NextFunction) {
    if (req.user) {
        return res.status(403).send('You are already logged in');
    }

    return next();
}