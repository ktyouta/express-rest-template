import { NextFunction, Request, Response } from "express";
import { envFlags } from "../config/env.flags";
import { HTTP_STATUS } from "../const/http-status.const";
import { ApiResponse } from "../util/api-response";

export function userOperationGuardMiddleware(req: Request, res: Response, next: NextFunction) {

    if (!envFlags.allowUserOperation) {
        return ApiResponse.create(res, HTTP_STATUS.FORBIDDEN, `この機能は現在の環境では無効化されています。`);
    }

    next();
}