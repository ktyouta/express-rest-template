import { NextFunction, Response } from "express";
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
import { DeleteFrontUserUseCase } from "../usecase/delete-front-user.usecase";


export class DeleteFrontUserController extends RouteController {

    private readonly useCase = new DeleteFrontUserUseCase();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel({
            httpMethodType: HTTP_METHOD.DELETE,
            executeFunction: this.doExecute,
            endPoint: API_ENDPOINT.FRONT_USER_ID,
            middlewares: [
                userOperationGuardMiddleware,
                authMiddleware
            ],
        });
    }

    /**
     * ユーザー情報を削除する
     * @param req
     * @param res
     * @returns
     */
    async doExecute(req: AuthenticatedRequestType, res: Response, next: NextFunction) {

        const userId = req.user.userId;

        // パスパラメータのバリデーションチェック
        const pathValidateResult = PathParamSchema.safeParse(req.params);

        if (!pathValidateResult.success) {
            throw Error(`${formatZodErrors(pathValidateResult.error.errors)}`);
        }

        const pathUserId = pathValidateResult.data.userId;

        // パスパラメータのユーザーIDとtokenのユーザーIDを比較
        if (userId.value !== pathUserId) {
            throw Error(`ユーザーIDが不正です `);
        }

        const result = await this.useCase.execute(userId);

        if (!result.success) {
            return ApiResponse.create(res, result.status, result.message);
        }

        return ApiResponse.create(res, result.status, result.message);
    }
}
