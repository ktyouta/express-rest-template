import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from 'express';
import { ZodIssue } from "zod";
import { envFlags } from "../../../config/env.flags";
import { HTTP_STATUS } from "../../../consts/http-status.const";
import { AccessToken } from "../../../domain/accesstoken/access-token";
import { RefreshToken } from "../../../domain/refreshtoken/fefresh-token";
import { PrismaTransaction } from "../../../infrastructure/prisma/prisma-transaction";
import { API_ENDPOINT } from "../../../routes/api-endpoint.const";
import { HTTP_METHOD } from "../../../routes/http-method.type";
import { RouteController } from "../../../routes/route-controller";
import { RouteSettingModel } from "../../../routes/route-setting.model";
import { ApiResponse } from "../../../util/api-response";
import { FrontUserBirthday } from "../../domain/front-user-birthday";
import { FrontUserName } from "../../domain/front-user-name";
import { FrontUserPassword } from "../../domain/front-user-password";
import { FrontUserSalt } from "../../domain/front-user-salt";
import { CreateFrontUserResponseDto } from "../dto/create-front-user-response.dto";
import { FrontUserLoginEntity } from "../entity/front-user-login.entity";
import { FrontUserEntity } from "../entity/front-user.entity";
import { CreateFrontUserRequestSchema, CreateFrontUserRequestType } from "../schema/create-front-user-request.schema";
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
        const validateResult = CreateFrontUserRequestSchema.safeParse(req.body);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`\r\n`);

            return ApiResponse.create(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        const requestBody: CreateFrontUserRequestType = validateResult.data;
        const userName = new FrontUserName(requestBody.userName);
        const userBirthDay = new FrontUserBirthday(requestBody.userBirthday);
        const salt = FrontUserSalt.generate();
        const userPassword = FrontUserPassword.hash(requestBody.password, salt);

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