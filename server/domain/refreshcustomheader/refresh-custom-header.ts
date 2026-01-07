import { Header } from "../header/header";


export class RefreshCustomHeader {

    // ヘッダのキー
    static readonly HEADER_KEY: string = `X-CSRF-Token`;
    // カスタムヘッダ設定値
    static readonly HEADER_VALUE: string = `web`;
    private readonly _value: string;

    constructor(headerModel: Header) {

        const value = headerModel.get(RefreshCustomHeader.HEADER_KEY);

        if (!value) {
            throw Error(`リフレッシュ用のヘッダ未設定`);
        }

        this._value = value;
    }

    /**
     * カスタムヘッダ設定値チェック
     * @returns 
     */
    isValid() {
        return this._value === RefreshCustomHeader.HEADER_VALUE;
    }
}