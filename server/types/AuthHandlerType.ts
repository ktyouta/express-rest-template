import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from './AuthenticatedRequest';

export type AuthHandler = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => Promise<void> | void;
