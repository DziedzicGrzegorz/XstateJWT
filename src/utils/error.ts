import {NextFunction, Request, Response} from "express";

export class ValidationError extends Error {
}

export const handleError = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res
        .status(err instanceof ValidationError ? 400 : 500)
        .send({message: err instanceof ValidationError ? err.message : 'Przepraszamy,'});
    next();
}
