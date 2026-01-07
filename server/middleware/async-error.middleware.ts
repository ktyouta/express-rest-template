import { NextFunction, Request, Response } from 'express';

export class AsyncErrorMiddleware {

    public static handler(fn: Function) {

        return function (req: Request, res: Response, next: NextFunction) {

            Promise.resolve(
                fn(req, res, next)
            ).catch(next);
        };
    }
}