import { HTTP_STATUS } from "../../../const/http-status.const";
import { AccessToken } from "../../../domain/accesstoken/access-token";
import { AuthOrigin } from "../../../domain/authorigin/auth-origin";
import { Cookie } from "../../../domain/cookie/cookie";
import { Header } from "../../../domain/header/header";
import { RefreshCustomHeader } from "../../../domain/refreshcustomheader/refresh-custom-header";
import { RefreshToken } from "../../../domain/refreshtoken/refresh-token";
import { RefreshService } from "../service/refresh.service";

// 入力型
type Input = {
    cookie: Cookie;
    header: Header;
};

// 出力型
type Output = {
    status: number;
    message: string;
} & (
    {
        success: true;
        data: {
            accessToken: string;
            refreshToken: string;
        };
    } |
    {
        success: false;
    }
);

export class RefreshUseCase {

    private readonly service: RefreshService = new RefreshService();

    constructor() {}

    async execute(input: Input): Promise<Output> {

        const authOrigin = new AuthOrigin(input.header);

        // 許可Originチェック
        if (!authOrigin.isAllowed()) {
            return {
                success: false as const,
                status: HTTP_STATUS.UNAUTHORIZED,
                message: '許可されていないOrigin',
            };
        }

        const customHeader = new RefreshCustomHeader(input.header);

        // カスタムヘッダチェック
        if (!customHeader.isValid()) {
            return {
                success: false as const,
                status: HTTP_STATUS.UNAUTHORIZED,
                message: 'カスタムヘッダが不正',
            };
        }

        // リフレッシュトークン
        const refreshToken = RefreshToken.get(input.cookie);

        // 認証
        const userId = refreshToken.getPayload();

        // ユーザー情報取得
        const userInfo = await this.service.getUser(userId);

        if (!userInfo || userInfo.length === 0) {
            return {
                success: false as const,
                status: HTTP_STATUS.UNAUTHORIZED,
                message: 'リフレッシュトークンからユーザー情報を取得できませんでした',
            };
        }

        // リフレッシュトークンの絶対期限チェック
        if (refreshToken.isAbsoluteExpired()) {
            return {
                success: false as const,
                status: HTTP_STATUS.UNAUTHORIZED,
                message: 'リフレッシュトークンの絶対期限切れ',
            };
        }

        // リフレッシュトークン再発行
        const newRefreshToken = refreshToken.refresh();

        // アクセストークン発行
        const accessToken = AccessToken.create(userId);

        return {
            success: true as const,
            status: HTTP_STATUS.OK,
            message: '認証成功',
            data: {
                accessToken: accessToken.token,
                refreshToken: newRefreshToken.value,
            },
        };
    }
}
