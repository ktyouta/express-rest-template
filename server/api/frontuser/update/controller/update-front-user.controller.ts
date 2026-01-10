import { Prisma } from "@prisma/client";
import { NextFunction, Response } from "express";
import { HTTP_STATUS } from "../../../../const/http-status.const";
import { FrontUserName } from "../../../../domain/frontusername/front-user-name";
import { RefreshToken } from "../../../../domain/refreshtoken/refresh-token";
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
import { FrontUserBirthday } from "../../domain/front-user-birthday";
import { UpdateFrontUserResponseDto } from "../dto/update-front-user-response.dto";
import { FrontUserLoginEntity } from "../entity/front-user-login.entity";
import { FrontUserEntity } from "../entity/front-user.entity";
import { PathParamSchema } from "../schema/path-param.schema";
import { RequestBodySchema, RequestBodySchemaType } from "../schema/request-body.schema";
import { UpdateFrontUserService } from "../service/update-front-user.service";


export class UpdateFrontUserController extends RouteController {

    private readonly updateFrontUserService = new UpdateFrontUserService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HTTP_METHOD.PUT,
            this.doExecute,
            API_ENDPOINT.FRONT_USER_ID,
            [
                userOperationGuardMiddleware,
                authMiddleware
            ],
        );
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

        const requestBody: RequestBodySchemaType = validateResult.data;
        const userName = new FrontUserName(requestBody.userName);
        const userBirthDay = new FrontUserBirthday(requestBody.userBirthday);

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // ユーザーの存在チェック
            if (await this.updateFrontUserService.checkUserNameExists(userId, userName)) {
                return ApiResponse.create(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, `既にユーザーが存在しています。`);
            }

            // ユーザーログイン情報を更新する
            const loginUserEntity = new FrontUserLoginEntity(
                userId,
                userName,
            );

            await this.updateFrontUserService.updateFrontLoginUser(loginUserEntity, tx);

            // ユーザー情報を更新する
            const frontUserEntity = new FrontUserEntity(
                userId,
                userName,
                userBirthDay
            );

            await this.updateFrontUserService.updateFrontUser(frontUserEntity, tx);

            // リフレッシュトークンを発行
            const refreshToken = RefreshToken.create(userId);

            // cookieを返却
            res.cookie(RefreshToken.COOKIE_KEY, refreshToken.token, RefreshToken.COOKIE_SET_OPTION);

            // レスポンスを作成
            const response = new UpdateFrontUserResponseDto(frontUserEntity);

            return ApiResponse.create(res, HTTP_STATUS.CREATED, `ユーザー情報の更新が完了しました。`, response.value);
        }, next);
    }
}