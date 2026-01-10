import { Prisma } from "@prisma/client";
import { NextFunction, Response } from "express";
import { HTTP_STATUS } from "../../../../const/http-status.const";
import { PrismaTransaction } from "../../../../infrastructure/prisma/prisma-transaction";
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
import { DeleteFrontUserService } from "../service/delete-front-user.service";


export class DeleteFrontUserController extends RouteController {

    private readonly deleteFrontUserService = new DeleteFrontUserService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HTTP_METHOD.DELETE,
            this.doExecute,
            API_ENDPOINT.FRONT_USER_ID,
            [
                userOperationGuardMiddleware,
                authMiddleware
            ],
        );
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

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // ユーザーログイン情報を削除する
            await this.deleteFrontUserService.deleteFrontLoginUser(userId, tx);

            // ユーザー情報を削除する
            await this.deleteFrontUserService.deleteFrontUser(userId, tx);

            return ApiResponse.create(res, HTTP_STATUS.NO_CONTENT, `ユーザーの削除が完了しました。`);
        }, next);
    }
}