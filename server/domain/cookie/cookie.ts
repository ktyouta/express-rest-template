import { Request } from 'express';

export class Cookie {

    private _value: Record<string, string>;

    constructor(req: Request) {

        if (!req) {
            throw Error(`リクエストが存在しません。`);
        }

        this._value = req.cookies;
    }

    get cookie() {
        return this._value;
    }
}