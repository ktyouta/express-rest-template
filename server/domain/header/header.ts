import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

export class Header {

    private readonly _value: IncomingHttpHeaders;

    constructor(req: Request) {

        if (!req) {
            throw Error(`リクエストが存在しません。`);
        }

        this._value = req.headers;
    }

    get headers() {
        return this._value;
    }

    get(name: string): string | undefined {

        const value = this._value[name.toLowerCase()];

        if (Array.isArray(value)) {
            return value[0];
        }

        return value;
    }
}