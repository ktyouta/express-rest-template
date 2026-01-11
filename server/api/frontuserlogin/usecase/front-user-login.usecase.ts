import { Prisma } from "@prisma/client";
import { HTTP_STATUS } from "../../../const/http-status.const";
import { AccessToken } from "../../../domain/accesstoken/access-token";
import { FrontUserId } from "../../../domain/frontuserid/front-user-id";
import { FrontUserName } from "../../../domain/frontusername/front-user-name";
import { FrontUserPassword } from "../../../domain/frontuserpassword/front-user-password";
import { FrontUserSalt } from "../../../domain/frontusersalt/front-user-salt";
import { Pepper } from "../../../domain/pepper/pepper";
import { RefreshToken } from "../../../domain/refreshtoken/refresh-token";
import { PrismaTransaction } from "../../../infrastructure/prisma/prisma-transaction";
import { AuthUserInfoType } from "../../../type/auth-user.type";
import { LOGIN_ERR_MESSAGE } from "../const/front-user-login.consts";
import { FrontUserLoginResponseDto } from "../dto/front-user-login-response.dto";
import { RequestBodySchemaType } from "../schema/request-body.schema";
import { FrontUserLoginService } from "../service/front-user-login.service";


// 出力型
type Output = {
    status: number,
    message: string,
} & (
        {
            success: true,
            data: {
                response: AuthUserInfoType,
                refreshToken: string,
            },
        } |
        {
            success: false,
        }
    );

export class FrontUserLoginUseCase {

    private readonly service: FrontUserLoginService = new FrontUserLoginService();

    constructor() { }

    async execute(requestBody: RequestBodySchemaType) {

        const result = await PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            const userName = new FrontUserName(requestBody.userName);

            // ログインユーザーを取得
            const frontUserLoginList = await this.service.getLoginUser(userName);

            if (frontUserLoginList.length === 0) {
                return this.unauthorized();
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
                return this.unauthorized();
            }

            // ユーザー情報を取得
            const frontUserList = await this.service.getUserInfo(frontUserId);

            if (frontUserList.length === 0) {
                return this.unauthorized();
            }

            const frontUser = frontUserList[0];

            // トークン発行
            const accessToken = AccessToken.create(frontUserId);
            const refreshToken = RefreshToken.create(frontUserId);

            // 最終ログイン日時を更新する
            await this.service.updateLastLoginDate(frontUserId, tx);

            // レスポンス
            const responseDto = new FrontUserLoginResponseDto(frontUser, accessToken);

            return {
                success: true,
                status: HTTP_STATUS.OK,
                message: 'ログイン成功',
                data: {
                    response: responseDto.data,
                    refreshToken: refreshToken.value,
                },
            };
        });

        return result;
    }

    /**
     * 認証エラーレスポンス
     */
    private unauthorized(): Output {
        return {
            success: false,
            status: HTTP_STATUS.UNAUTHORIZED,
            message: LOGIN_ERR_MESSAGE,
        };
    }
}