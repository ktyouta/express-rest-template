import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

export class Header {

    private readonly _headers: IncomingHttpHeaders;

    constructor(req: Request) {

        if (!req) {
            throw Error(`リクエストが存在しません。`);
        }

        this._headers = req.headers;
    }

    get headers() {
        return this._headers;
    }

    get(name: string): string | undefined {

        const value = this._headers[name.toLowerCase()];

        if (Array.isArray(value)) {
            return value[0];
        }

        return value;
    }
}