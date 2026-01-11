import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from "../../../../const/http-status.const";
import { RefreshToken } from "../../../../domain/refreshtoken/refresh-token";
import { userOperationGuardMiddleware } from "../../../../middleware/user-operation-guard.middleware";
import { API_ENDPOINT } from "../../../../router/api-endpoint.const";
import { HTTP_METHOD } from "../../../../router/http-method.type";
import { RouteController } from "../../../../router/route-controller";
import { RouteSettingModel } from "../../../../router/route-setting-model";
import { ApiResponse } from "../../../../util/api-response";
import { formatZodErrors } from "../../../../util/validation.util";
import { RequestBodySchema } from "../schema/request-body.schema";
import { CreateFrontUserUseCase } from "../usecase/create-front-user.usecase";


export class CreateFrontUserController extends RouteController {

    private readonly useCase = new CreateFrontUserUseCase();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel({
            httpMethodType: HTTP_METHOD.POST,
            executeFunction: this.doExecute,
            endPoint: API_ENDPOINT.FRONT_USER,
            middlewares: [userOperationGuardMiddleware],
        });
    }

    /**
     * ユーザー情報を登録する
     * @param req
     * @param res
     * @returns
     */
    async doExecute(req: Request, res: Response, next: NextFunction) {

        // リクエストのバリデーションチェック
        const validateResult = RequestBodySchema.safeParse(req.body);

        // バリデーションエラー
        if (!validateResult.success) {
            return ApiResponse.create(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, formatZodErrors(validateResult.error.errors));
        }

        const result = await this.useCase.execute(validateResult.data);

        if (!result.success) {
            return ApiResponse.create(res, result.status, result.message);
        }

        // cookieを返却
        res.cookie(RefreshToken.COOKIE_KEY, result.data.refreshToken, RefreshToken.COOKIE_SET_OPTION);

        return ApiResponse.create(res, result.status, result.message, result.data.response);
    }
}
