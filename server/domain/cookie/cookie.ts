import { Request } from 'express';

export class Cookie {

    private _cookie: Record<string, string>;

    constructor(req: Request) {

        if (!req) {
            throw Error(`リクエストが存在しません。`);
        }

        this._cookie = req.cookies;
    }

    get cookie() {
        return this._cookie;
    }
}