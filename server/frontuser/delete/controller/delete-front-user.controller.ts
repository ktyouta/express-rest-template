import { Prisma } from "@prisma/client";
import { NextFunction, Response } from "express";
import { envFlags } from "../../../config/env.flags";
import { HTTP_STATUS } from "../../../const/http-status.const";
import { PrismaTransaction } from "../../../infrastructure/prisma/prisma-transaction";
import { authMiddleware } from "../../../middleware/auth.middleware";
import { API_ENDPOINT } from "../../../router/api-endpoint.const";
import { HTTP_METHOD } from "../../../router/http-method.type";
import { RouteController } from "../../../router/route-controller";
import { RouteSettingModel } from "../../../router/route-setting-model";
import { AuthenticatedRequestType } from "../../../type/authenticated-request.type";
import { ApiResponse } from "../../../util/api-response";
import { PathParamSchema } from "../schema/path-param.schema";
import { DeleteFrontUserService } from "../service/delete-front-user.service";


export class DeleteFrontUserController extends RouteController {

    private readonly deleteFrontUserService = new DeleteFrontUserService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HTTP_METHOD.DELETE,
            this.doExecute,
            API_ENDPOINT.FRONT_USER_ID,
            [authMiddleware],
        );
    }

    /**
     * ユーザー情報を削除する
     * @param req 
     * @param res 
     * @returns 
     */
    async doExecute(req: AuthenticatedRequestType, res: Response, next: NextFunction) {

        if (!envFlags.allowUserOperation) {
            return ApiResponse.create(res, HTTP_STATUS.FORBIDDEN, `この機能は現在の環境では無効化されています。`);
        }

        const userId = req.user.userId;

        // パスパラメータのバリデーションチェック
        const pathValidateResult = PathParamSchema.safeParse(req.params);

        if (!pathValidateResult.success) {
            throw Error(`${pathValidateResult.error.message}`);
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