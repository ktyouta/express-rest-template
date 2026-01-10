import { FrontUserId } from "../../../../domain/frontuserid/front-user-id";
import { FrontUserName } from "../../../../domain/frontusername/front-user-name";
import { FrontUserPassword } from "../../../../domain/frontuserpassword/front-user-password";
import { FrontUserSalt } from "../../../../domain/frontusersalt/front-user-salt";


export class FrontUserLoginEntity {

    // ユーザーID
    private readonly _frontUserId: FrontUserId;
    // パスワード
    private readonly _frontUserPassword: FrontUserPassword;
    // ソルト値
    private readonly _frontUserSalt: FrontUserSalt;
    // ユーザー名
    private readonly _frontUserName: FrontUserName;

    constructor(userId: FrontUserId,
        frontUserName: FrontUserName,
        frontUserPassword: FrontUserPassword,
        salt: FrontUserSalt,
    ) {

        this._frontUserId = userId;
        this._frontUserPassword = frontUserPassword;
        this._frontUserSalt = salt;
        this._frontUserName = frontUserName;
    }

    get frontUserId() {
        return this._frontUserId.value;
    }

    get frontUserPassword() {
        return this._frontUserPassword.value;
    }

    get salt() {
        return this._frontUserSalt.salt;
    }

    get frontUserName() {
        return this._frontUserName.value;
    }
}