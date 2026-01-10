import { AccessToken } from "../accesstoken/access-token";


export class FrontUserId {

    private _value: number;

    private constructor(userId: number) {

        if (!userId) {
            throw Error(`ユーザーIDが設定されていません。`);
        }

        this._value = userId;
    }

    get value() {
        return this._value;
    }

    /**
     * ユーザーIDをセット
     * @param userId 
     * @returns 
     */
    static of(userId: number) {
        return new FrontUserId(userId);
    }

    /**
     * アクセストークンからユーザーIDを取得
     * @param accessTokenModel 
     * @returns 
     */
    static fromAccessToken(accessTokenModel: AccessToken) {
        return accessTokenModel.getPayload();
    }
}