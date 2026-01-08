import { AUTH_ALLOWED_ORIGINS } from "../../config/cors-allowed-origins";
import { Header } from "../header/header";


export class AuthOrigin {

    // ヘッダのキー
    static readonly HEADER_KEY: string = `origin`;
    private readonly _value: string;

    constructor(header: Header) {


        const origin = header.get(AuthOrigin.HEADER_KEY);

        if (!origin) {
            throw Error(`Origin未設定`);
        }

        this._value = origin;
    }

    /**
     * 許可Originチェック
     * @returns 
     */
    isAllowed() {
        return AUTH_ALLOWED_ORIGINS.some(e => e === this._value);
    }
}