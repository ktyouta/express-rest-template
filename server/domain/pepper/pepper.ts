import { envConfig } from "../../config/env.config";

export class Pepper {

    private readonly _value: string;
    // ペッパー値(環境変数設定値)
    private readonly ACCESS_TOKEN_EXPIRES = envConfig.pepper;

    constructor() {

        if (!this.ACCESS_TOKEN_EXPIRES) {
            throw Error(`環境変数にpepperが設定されていません。`);
        }

        this._value = this.ACCESS_TOKEN_EXPIRES;
    }

    get value() {
        return this._value;
    }
}