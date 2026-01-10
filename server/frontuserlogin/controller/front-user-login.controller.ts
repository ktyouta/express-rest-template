import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { ZodIssue } from 'zod';
import { HTTP_STATUS } from '../../const/http-status.const';
import { AccessToken } from '../../domain/accesstoken/access-token';
import { FrontUserId } from '../../domain/frontuserid/front-user-id';
import { FrontUserName } from '../../domain/frontusername/front-user-name';
import { FrontUserPassword } from '../../domain/frontuserpassword/front-user-password';
import { FrontUserSalt } from '../../domain/frontusersalt/front-user-salt';
import { Pepper } from '../../domain/pepper/pepper';
import { RefreshToken } from '../../domain/refreshtoken/refresh-token';
import { PrismaTransaction } from '../../infrastructure/prisma/prisma-transaction';
import { API_ENDPOINT } from '../../router/api-endpoint.const';
import { HTTP_METHOD } from '../../router/http-method.type';
import { RouteController } from '../../router/route-controller';
import { RouteSettingModel } from '../../router/route-setting-model';
import { ApiResponse } from '../../util/api-response';
import { LOGIN_ERR_MESSAGE } from '../const/front-user-login.consts';
import { FrontUserLoginResponseDto } from '../dto/front-user-login-response.dto';
import { RequestBodySchema } from '../schema/request-body.schema';
import { FrontUserLoginService } from '../service/front-user-login.service';


export class FrontUserLoginController extends RouteController {

    private readonly frontUserLoginService = new FrontUserLoginService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HTTP_METHOD.POST,
            this.doExecute,
            API_ENDPOINT.FRONT_USER_LOGIN,
        );
    }

    /**
     * ログイン
     * @param req 
     * @param res 
     * @returns 
     */
    async doExecute(req: Request, res: Response, next: NextFunction) {

        // リクエストのバリデーションチェック
        const validateResult = RequestBodySchema.safeParse(req.body);

        // バリデーションエラー
        if (!validateResult.success) {

            // エラーメッセージを取得
            const validatErrMessage = validateResult.error.errors.map((e: ZodIssue) => {
                return e.message;
            }).join(`,`);

            return ApiResponse.create(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, validatErrMessage);
        }

        const requestBody = validateResult.data;
        const userName = new FrontUserName(requestBody.userName);

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // ログインユーザーを取得
            const frontUserLoginList = await this.frontUserLoginService.getLoginUser(userName);

            // ユーザーの取得に失敗
            if (frontUserLoginList.length === 0) {
                return ApiResponse.create(res, HTTP_STATUS.UNAUTHORIZED, LOGIN_ERR_MESSAGE);
            }

            const frontUserLogin = frontUserLoginList[0];
            const frontUserId = FrontUserId.of(frontUserLogin.userId);
            const salt = frontUserLogin.salt;
            const frontUserSalt = FrontUserSalt.of(salt);
            const pepper = new Pepper();

            // テーブルから取得したソルト値とペッパー値をもとに入力されたパスワードをハッシュ化する
            const password = FrontUserPassword.hash(requestBody.password, frontUserSalt, pepper);

            // パスワード認証に失敗
            if (password.value !== frontUserLogin.password) {
                return ApiResponse.create(res, HTTP_STATUS.UNAUTHORIZED, LOGIN_ERR_MESSAGE);
            }

            // ユーザー情報を取得
            const frontUserList = await this.frontUserLoginService.getUserInfo(frontUserId);

            // ユーザーの取得に失敗
            if (frontUserList.length === 0) {
                return ApiResponse.create(res, HTTP_STATUS.UNAUTHORIZED, LOGIN_ERR_MESSAGE);
            }

            const frontUser = frontUserList[0];

            // アクセストークンを発行
            const accessToken = AccessToken.create(frontUserId);

            // リフレッシュトークンを発行
            const refreshToken = RefreshToken.create(frontUserId);

            // レスポンスを作成
            const frontUserLoginCreateResponse = new FrontUserLoginResponseDto(frontUser, accessToken);

            // 最終ログイン日時を更新する
            await this.frontUserLoginService.updateLastLoginDate(frontUserId, tx);

            // cookieを返却
            res.cookie(RefreshToken.COOKIE_KEY, refreshToken.token, RefreshToken.COOKIE_SET_OPTION);

            return ApiResponse.create(res, HTTP_STATUS.OK, `ログイン成功`, frontUserLoginCreateResponse.data);
        }, next);
    }
}