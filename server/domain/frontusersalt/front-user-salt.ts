import { randomBytes } from "crypto";

export class FrontUserSalt {

    private readonly _value: string;
    private static BYTE_SIZE = 16;
    private static ENCODING: BufferEncoding = `hex`;

    private constructor(salt: string) {

        if (!salt) {
            throw Error(`ソルト値が設定されていません。`);
        }

        this._value = salt;
    }

    /**
     * ソルト値を生成
     */
    static generate() {

        const salt = randomBytes(FrontUserSalt.BYTE_SIZE).toString(FrontUserSalt.ENCODING);

        return new FrontUserSalt(salt);
    }

    static of(salt: string) {
        return new FrontUserSalt(salt);
    }

    get salt() {
        return this._value;
    }
}