import { NextFunction, Response } from 'express';
import { AuthenticatedRequestType } from './authenticated-request.type';

export type AuthHandlerType = (
    req: AuthenticatedRequestType,
    res: Response,
    next: NextFunction
) => Promise<void> | void;
