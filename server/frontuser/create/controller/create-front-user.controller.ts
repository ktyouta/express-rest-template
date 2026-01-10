import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from 'express';
import { ZodIssue } from "zod";
import { envFlags } from "../../../config/env.flags";
import { HTTP_STATUS } from "../../../const/http-status.const";
import { AccessToken } from "../../../domain/accesstoken/access-token";
import { FrontUserName } from "../../../domain/frontusername/front-user-name";
import { FrontUserPassword } from "../../../domain/frontuserpassword/front-user-password";
import { FrontUserSalt } from "../../../domain/frontusersalt/front-user-salt";
import { Pepper } from "../../../domain/pepper/pepper";
import { RefreshToken } from "../../../domain/refreshtoken/refresh-token";
import { PrismaTransaction } from "../../../infrastructure/prisma/prisma-transaction";
import { API_ENDPOINT } from "../../../router/api-endpoint.const";
import { HTTP_METHOD } from "../../../router/http-method.type";
import { RouteController } from "../../../router/route-controller";
import { RouteSettingModel } from "../../../router/route-setting-model";
import { ApiResponse } from "../../../util/api-response";
import { FrontUserBirthday } from "../../domain/front-user-birthday";
import { CreateFrontUserResponseDto } from "../dto/create-front-user-response.dto";
import { FrontUserLoginEntity } from "../entity/front-user-login.entity";
import { FrontUserEntity } from "../entity/front-user.entity";
import { RequestBodySchema, RequestBodySchemaType } from "../schema/request-body.schema";
import { CreateFrontUserService } from "../service/create-front-user.service";


export class CreateFrontUserController extends RouteController {

    private readonly createFrontUserService = new CreateFrontUserService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HTTP_METHOD.POST,
            this.doExecute,
            API_ENDPOINT.FRONT_USER,
        );
    }

    /**
     * ユーザー情報を登録する
     * @param req 
     * @param res 
     * @returns 
     */
    doExecute(req: Request, res: Response, next: NextFunction) {

        if (!envFlags.allowUserOperation) {
            return ApiResponse.create(res, HTTP_STATUS.FORBIDDEN, `この機能は現在の環境では無効化されています。`);
        }

        // リクエストのバリデーションチェック
        const validateResult = RequestBodySchema.safeParse(req.body);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`\r\n`);

            return ApiResponse.create(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        const requestBody: RequestBodySchemaType = validateResult.data;
        const userName = new FrontUserName(requestBody.userName);
        const userBirthDay = new FrontUserBirthday(requestBody.userBirthday);
        const salt = FrontUserSalt.generate();
        const pepper = new Pepper();
        const userPassword = FrontUserPassword.hash(requestBody.password, salt, pepper);

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // ユーザー重複チェック
            if (await this.createFrontUserService.checkUserNameExists(userName)) {
                return ApiResponse.create(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, `既にユーザーが存在しています。`);
            }

            // ユーザーIDを採番する
            const frontUserId = await this.createFrontUserService.createUserId(tx);

            // ユーザーログイン情報を追加する
            const loginUserEntity = new FrontUserLoginEntity(
                frontUserId,
                userName,
                userPassword,
                salt,
            );

            await this.createFrontUserService.insertFrontLoginUser(loginUserEntity, tx);

            // ユーザー情報を追加する
            const userEntity = new FrontUserEntity(
                frontUserId,
                userName,
                userBirthDay
            );

            await this.createFrontUserService.insertFrontUser(userEntity, tx);

            // アクセストークンを発行
            const accessToken = AccessToken.create(frontUserId);

            // リフレッシュトークンを発行
            const refreshToken = RefreshToken.create(frontUserId);

            // レスポンスを作成
            const response = new CreateFrontUserResponseDto(userEntity, accessToken);

            // cookieを返却
            res.cookie(RefreshToken.COOKIE_KEY, refreshToken.token, RefreshToken.COOKIE_SET_OPTION);

            return ApiResponse.create(res, HTTP_STATUS.CREATED, `ユーザー情報の登録が完了しました。`, response.value);
        }, next);
    }
}