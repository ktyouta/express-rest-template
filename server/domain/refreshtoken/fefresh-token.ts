import { CookieOptions } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { envConfig } from '../../config/env.config';
import { envFlags } from '../../config/env.flags';
import { parseDuration } from '../../util/parse-duration.util';
import { Cookie } from '../cookie/cookie';
import { FrontUserId } from '../frontuserid/front-user-id';


export class RefreshToken {

    private static readonly jwt = require("jsonwebtoken");
    // トークン
    private readonly _token: string;
    // cookieのキー
    static readonly COOKIE_KEY: string = `refresh_token`;
    // リフレッシュトークン用のjwtキー
    private static readonly JWT_KEY = envConfig.refreshTokenExpires;
    // リフレッシュトークン有効期間
    private static readonly REFRESH_TOKEN_EXPIRES = envConfig.refreshTokenExpires;
    // cookieオプション
    private static readonly COOKIE_BASE_OPTION: CookieOptions = {
        httpOnly: true,
        secure: envFlags.isProduction,
        sameSite: envFlags.isProduction ? 'none' : 'lax',
    };
    // cookieオプション(生成)
    static readonly COOKIE_SET_OPTION: CookieOptions = {
        ...RefreshToken.COOKIE_BASE_OPTION,
        maxAge: parseDuration(
            RefreshToken.REFRESH_TOKEN_EXPIRES
        ),
    };
    // cookieオプション(失効)
    static readonly COOKIE_CLEAR_OPTION: CookieOptions = {
        ...RefreshToken.COOKIE_BASE_OPTION,
    };

    private constructor(token: string) {
        this._token = token;
    }

    /**
     * トークンを取得
     * @param cookie 
     * @returns 
     */
    static get(cookie: Cookie) {

        const token = cookie.cookie[RefreshToken.COOKIE_KEY];

        if (!token) {
            throw Error(`トークンが存在しません。`);
        }

        return new RefreshToken(token);
    }

    /**
     * トークンの発行
     * @param frontUserId 
     * @returns 
     */
    static create(frontUserId: FrontUserId) {

        if (!RefreshToken.JWT_KEY) {
            throw Error(`設定ファイルにjwt(リフレッシュ)の秘密鍵が設定されていません。`);
        }

        if (!RefreshToken.REFRESH_TOKEN_EXPIRES) {
            throw Error(`設定ファイルにリフレッシュトークンの有効期限が設定されていません。`);
        }

        const id = frontUserId.value;

        if (!id) {
            throw Error(`リフレッシュトークンの作成にはユーザーIDが必要です。`);
        }

        const jwtStr = `${id}`;
        const nowSec = Math.floor(Date.now() / 1000);

        const token = RefreshToken.jwt.sign(
            {
                sub: jwtStr,
                iat: nowSec,
                sessionStartedAt: nowSec,
            },
            RefreshToken.JWT_KEY,
            { expiresIn: RefreshToken.REFRESH_TOKEN_EXPIRES },
        );

        return new RefreshToken(token);
    }

    /**
     * トークン再発行
     */
    refresh() {

        const decoded = this.verify();
        const nowSec = Math.floor(Date.now() / 1000);

        if (!decoded.sub || !decoded.iat) {
            throw Error(`Claimの設定が不足しています。`);
        }

        const token = RefreshToken.jwt.sign(
            {
                sub: decoded.sub,
                iat: decoded.iat,
                sessionStartedAt: nowSec,
            },
            RefreshToken.JWT_KEY,
            { expiresIn: RefreshToken.REFRESH_TOKEN_EXPIRES },
        );

        return new RefreshToken(token);
    }

    /**
     * トークンチェック
     * @returns 
     */
    private verify() {

        try {

            const decoded = RefreshToken.jwt.verify(this.token, RefreshToken.JWT_KEY) as JwtPayload;

            if (!decoded || typeof decoded !== `object`) {
                throw Error(`アクセストークンが不正です。`);
            }

            return decoded;
        } catch (err) {
            throw Error(`アクセストークンの検証に失敗しました。${err}`);
        }
    }

    /**
     * トークンのペイロードを取得
     * @returns 
     */
    getPalyload() {

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

    /**
     * 絶対期限チェック
     */
    isAbsoluteExpired() {

        const decode = this.verify();

        if (!decode.iat) {
            throw new Error('iatが設定されていません。');
        }

        const nowMs = Date.now();
        const iatMs = decode.iat * 1000;

        return nowMs - iatMs > parseDuration(RefreshToken.REFRESH_TOKEN_EXPIRES);
    }

    get token() {
        return this._token;
    }
}