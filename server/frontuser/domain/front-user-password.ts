import { createHmac, scryptSync } from "crypto";
import { Pepper } from "../../domain/pepper/pepper";
import { FrontUserSalt } from "./front-user-salt";


export class FrontUserPassword {

    private _frontUserPassword: string;
    private static ENCODING: BufferEncoding = `hex`;
    private static HASH_LENGTH = 64;

    private constructor(hashedPassword: string) {

        this._frontUserPassword = hashedPassword;
    }

    /**
     * ハッシュ化(salt + pepper)
     */
    static secureHash(inputPassword: string, frontUserSaltValue: FrontUserSalt, pepper: Pepper) {

        if (!inputPassword) {
            throw Error(`ユーザーのパスワードが設定されていません。`);
        }

        const pepepr = pepper.value;
        const keyedPassword = createHmac('sha256', pepepr).update(inputPassword).digest();

        // パスワードをハッシュ化
        const salt = frontUserSaltValue.salt;
        const hashedPassword =
            scryptSync(keyedPassword, salt, FrontUserPassword.HASH_LENGTH).toString(FrontUserPassword.ENCODING);

        return new FrontUserPassword(hashedPassword);
    }

    /**
     * ハッシュ化(salt)
     */
    static hash(inputPassword: string, frontUserSaltValue: FrontUserSalt) {

        if (!inputPassword) {
            throw Error(`ユーザーのパスワードが設定されていません。`);
        }

        // パスワードをハッシュ化
        const salt = frontUserSaltValue.salt;
        const hashedPassword =
            scryptSync(inputPassword, salt, FrontUserPassword.HASH_LENGTH).toString(FrontUserPassword.ENCODING);

        return new FrontUserPassword(hashedPassword);
    }

    static reConstruct(hashedPassword: string) {
        return new FrontUserPassword(hashedPassword);
    }

    public get frontUserPassword() {
        return this._frontUserPassword;
    }

}