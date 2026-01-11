import { NextFunction, Response } from "express";
import { HTTP_STATUS } from "../../../../const/http-status.const";
import { RefreshToken } from "../../../../domain/refreshtoken/refresh-token";
import { authMiddleware } from "../../../../middleware/auth.middleware";
import { userOperationGuardMiddleware } from "../../../../middleware/user-operation-guard.middleware";
import { API_ENDPOINT } from "../../../../router/api-endpoint.const";
import { HTTP_METHOD } from "../../../../router/http-method.type";
import { RouteController } from "../../../../router/route-controller";
import { RouteSettingModel } from "../../../../router/route-setting-model";
import { AuthenticatedRequestType } from "../../../../type/authenticated-request.type";
import { ApiResponse } from "../../../../util/api-response";
import { formatZodErrors } from "../../../../util/validation.util";
import { PathParamSchema } from "../schema/path-param.schema";
import { RequestBodySchema } from "../schema/request-body.schema";
import { UpdateFrontUserUseCase } from "../usecase/update-front-user.usecase";


export class UpdateFrontUserController extends RouteController {

    private readonly useCase = new UpdateFrontUserUseCase();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel({
            httpMethodType: HTTP_METHOD.PUT,
            executeFunction: this.doExecute,
            endPoint: API_ENDPOINT.FRONT_USER_ID,
            middlewares: [
                userOperationGuardMiddleware,
                authMiddleware
            ],
        });
    }

    /**
     * ユーザー情報を更新する
     * @param req
     * @param res
     * @returns
     */
    async doExecute(req: AuthenticatedRequestType, res: Response, next: NextFunction) {

        const userId = req.user.userId;

        // パスパラメータのバリデーションチェック
        const pathValidateResult = PathParamSchema.safeParse(req.params);

        if (!pathValidateResult.success) {
            throw Error(`${pathValidateResult.error.message}`);
        }

        const pathUserId = pathValidateResult.data.userId;

        // リクエストのバリデーションチェック
        const validateResult = RequestBodySchema.safeParse(req.body);

        // バリデーションエラー
        if (!validateResult.success) {
            return ApiResponse.create(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, formatZodErrors(validateResult.error.errors));
        }

        // パスパラメータのユーザーIDとtokenのユーザーIDを比較
        if (userId.value !== pathUserId) {
            throw Error(`ユーザーIDが不正です `);
        }

        const result = await this.useCase.execute(userId, validateResult.data);

        if (!result.success) {
            return ApiResponse.create(res, result.status, result.message);
        }

        // cookieを返却
        res.cookie(RefreshToken.COOKIE_KEY, result.data.refreshToken, RefreshToken.COOKIE_SET_OPTION);

        return ApiResponse.create(res, result.status, result.message, result.data.response);
    }
}
