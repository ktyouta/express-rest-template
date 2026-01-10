import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../auth/serivce/auth.service';
import { HTTP_STATUS } from '../consts/http-status.const';
import { AccessToken } from '../domain/accesstoken/access-token';
import { Header } from '../domain/header/header';
import { ApiResponse } from '../util/api-response';


/**
 * トークン認証処理
 * @param req 
 * @param res 
 * @param next 
 */
export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {

        const service = new AuthService();

        const header = new Header(req);
        const accessToken = AccessToken.get(header);

        // トークン検証
        const userId = accessToken.getPalyload();

        // ユーザー情報取得
        const userInfoList = await service.select(userId);

        if (!userInfoList || userInfoList.length === 0) {
            throw Error(`認証エラー`);
        }

        const userInfo = userInfoList[0];

        req.user = {
            userId,
            info: userInfo,
        };

        next();
    } catch (err) {
        ApiResponse.create(res, HTTP_STATUS.UNAUTHORIZED, `認証エラー`);
    }
};
