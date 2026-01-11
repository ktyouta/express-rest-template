import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../../../const/http-status.const';
import { Cookie } from "../../../domain/cookie/cookie";
import { Header } from "../../../domain/header/header";
import { RefreshToken } from "../../../domain/refreshtoken/refresh-token";
import { Logger } from "../../../logger/logger";
import { API_ENDPOINT } from "../../../router/api-endpoint.const";
import { HTTP_METHOD } from "../../../router/http-method.type";
import { RouteController } from "../../../router/route-controller";
import { RouteSettingModel } from "../../../router/route-setting-model";
import { ApiResponse } from "../../../util/api-response";
import { RefreshUseCase } from "../usecase/refresh.usecase";


export class RefreshController extends RouteController {

    private readonly useCase = new RefreshUseCase();

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

            const result = await this.useCase.execute({
                cookie,
                header
            });

            if (!result.success) {
                Logger.warn(`Refresh failed: ${result.message}`);

                // エラー発生時はトークンを削除する
                res.clearCookie(RefreshToken.COOKIE_KEY, RefreshToken.COOKIE_CLEAR_OPTION);

                return ApiResponse.create(res, result.status, '認証失敗');
            }

            // cookieを返却
            res.cookie(RefreshToken.COOKIE_KEY, result.data?.refreshToken, RefreshToken.COOKIE_SET_OPTION);

            return ApiResponse.create(res, result.status, result.message, result.data?.accessToken);
        } catch (e) {

            Logger.warn(`Refresh failed: ${e}`);

            // エラー発生時はトークンを削除する
            res.clearCookie(RefreshToken.COOKIE_KEY, RefreshToken.COOKIE_CLEAR_OPTION);

            return ApiResponse.create(res, HTTP_STATUS.UNAUTHORIZED, '認証失敗');
        }
    }
}
