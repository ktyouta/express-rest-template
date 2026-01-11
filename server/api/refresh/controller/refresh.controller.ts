import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../../../const/http-status.const';
import { AccessToken } from "../../../domain/accesstoken/access-token";
import { AuthOrigin } from "../../../domain/authorigin/auth-origin";
import { Cookie } from "../../../domain/cookie/cookie";
import { Header } from "../../../domain/header/header";
import { RefreshCustomHeader } from "../../../domain/refreshcustomheader/refresh-custom-header";
import { RefreshToken } from "../../../domain/refreshtoken/refresh-token";
import { Logger } from "../../../logger/logger";
import { API_ENDPOINT } from "../../../router/api-endpoint.const";
import { HTTP_METHOD } from "../../../router/http-method.type";
import { RouteController } from "../../../router/route-controller";
import { RouteSettingModel } from "../../../router/route-setting-model";
import { ApiResponse } from "../../../util/api-response";
import { RefreshService } from "../service/refresh.service";


export class RefreshController extends RouteController {

    private readonly refreshService = new RefreshService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel({
            httpMethodType: HTTP_METHOD.POST,
            executeFunction: this.doExecute,
            endPoint: API_ENDPOINT.REFRESH,
        });
    }

    /**
     * トークンリフレッシュ
     * @param req 
     * @param res 
     * @returns 
     */
    async doExecute(req: Request, res: Response, next: NextFunction) {

        try {

            // cookie
            const cookie = new Cookie(req);
            // ヘッダー
            const header = new Header(req);
            const authOrigin = new AuthOrigin(header);

            // 許可Originチェック
            if (!authOrigin.isAllowed()) {
                throw Error(`許可されていないOrigin`);
            }

            const customHeader = new RefreshCustomHeader(header);

            // カスタムヘッダチェック
            if (!customHeader.isValid()) {
                throw Error(`カスタムヘッダが不正`);
            }

            // リフレッシュトークン
            const refreshToken = RefreshToken.get(cookie);

            // 認証
            const userId = refreshToken.getPayload();

            // ユーザー情報取得
            const userInfo = await this.refreshService.getUser(userId);

            if (!userInfo || userInfo.length === 0) {
                throw Error(`リフレッシュトークンからユーザー情報を取得できませんでした`);
            }

            // リフレッシュトークンの絶対期限チェック
            if (refreshToken.isAbsoluteExpired()) {
                throw new Error('リフレッシュトークンの絶対期限切れ');
            }

            // リフレッシュトークン再発行
            const newRefreshToken = refreshToken.refresh();
            res.cookie(RefreshToken.COOKIE_KEY, newRefreshToken.token, RefreshToken.COOKIE_SET_OPTION);

            // アクセストークン発行
            const accessToken = AccessToken.create(userId);

            return ApiResponse.create(res, HTTP_STATUS.OK, `認証成功`, accessToken.token);
        } catch (e) {

            Logger.warn(`Refresh failed:${e}`);

            // エラー発生時はトークンを削除する
            res.clearCookie(RefreshToken.COOKIE_KEY, RefreshToken.COOKIE_CLEAR_OPTION);

            return ApiResponse.create(res, HTTP_STATUS.UNAUTHORIZED, `認証失敗`);
        }
    }
}