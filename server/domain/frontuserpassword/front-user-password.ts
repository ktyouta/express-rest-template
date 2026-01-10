import { createHmac, scryptSync } from "crypto";
import { FrontUserSalt } from "../frontusersalt/front-user-salt";
import { Pepper } from "../pepper/pepper";


export class FrontUserPassword {

    private _value: string;
    private static ENCODING: BufferEncoding = `hex`;
    private static HASH_LENGTH = 64;

    private constructor(hashedPassword: string) {

        this._value = hashedPassword;
    }

    /**
     * ハッシュ化(salt + pepper)
     */
    static hash(inputPassword: string, frontUserSaltValue: FrontUserSalt, pepper: Pepper) {

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

    static of(hashedPassword: string) {
        return new FrontUserPassword(hashedPassword);
    }

    get value() {
        return this._value;
    }
}