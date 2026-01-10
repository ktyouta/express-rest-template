import { envConfig } from '../../config/env.config';
import { FrontUserId } from '../frontuserid/front-user-id';
import { Header } from '../header/header';
import { AccessTokenError } from './access-token.error';


export class AccessToken {

    private static readonly jwt = require("jsonwebtoken");
    // トークン
    private readonly _value: string;
    // ヘッダーのキー
    static readonly HEADER_KEY: string = `Authorization`;
    // 認証スキーム
    static readonly SCHEME: string = `Bearer`;
    // アクセストークン用のjwtキー
    private static readonly JWT_KEY = envConfig.accessTokenJwtKey;
    // アクセストークン有効期間
    private static readonly ACCESS_TOKEN_EXPIRES = envConfig.accessTokenExpires;

    private constructor(token: string) {
        this._value = token;
    }

    /**
     * トークンを取得
     * @param headerModel 
     * @returns 
     */
    static get(header: Header) {

        const authHeader = header.get(AccessToken.HEADER_KEY) || ``;
        const [scheme, token] = authHeader.split(` `);

        const accessToken = scheme === AccessToken.SCHEME && token ? token : ``;

        return new AccessToken(accessToken);
    }

    /**
     * トークンの発行
     * @param frontUserIdModel 
     * @returns 
     */
    static create(frontUserId: FrontUserId) {

        if (!AccessToken.JWT_KEY) {
            throw Error(`設定ファイルにjwt(アクセス)の秘密鍵が設定されていません。`);
        }

        if (!AccessToken.ACCESS_TOKEN_EXPIRES) {
            throw Error(`設定ファイルにアクセストークンの有効期限が設定されていません。`);
        }

        const id = frontUserId.value;

        if (!id) {
            throw Error(`アクセストークンの作成にはユーザーIDが必要です。`);
        }

        const jwtStr = `${id}`;
        const token = AccessToken.jwt.sign({ sub: jwtStr }, AccessToken.JWT_KEY, { expiresIn: AccessToken.ACCESS_TOKEN_EXPIRES });

        return new AccessToken(token);
    }

    /**
     * トークンチェック
     * @returns 
     */
    private verify() {

        try {

            const decoded = AccessToken.jwt.verify(this.token, AccessToken.JWT_KEY);

            if (!decoded || typeof decoded !== `object`) {
                throw new AccessTokenError(`アクセストークンが不正です。`);
            }

            return decoded;
        } catch (err) {
            throw new AccessTokenError(`アクセストークンの検証に失敗しました。${err}`);
        }
    }

    /**
     * トークンのペイロードを取得
     * @returns 
     */
    getPayload() {

        const decode = this.verify();

        if (!decode.sub) {
            throw new Error('subが設定されていません。');
        }

        const userId = Number(decode.sub);

        if (Number.isNaN(userId)) {
            throw new Error("ユーザーIDが不正です。");
        }

        return FrontUserId.of(userId);
    }

    get token() {
        return this._value;
    }
}