import { RequestHandler } from "express";
import { ApiEndopointType } from "./api-endpoint.const";
import { HttpMethodType } from "./http-method.type";

export class RouteSettingModel {

    // httpメソッド
    private readonly _httpMethodType: HttpMethodType;
    // 実行関数
    private readonly _executeFunction: Function;
    // エンドポイント
    private readonly _endPoint: ApiEndopointType;
    // ミドルウェア
    private readonly _middlewares: RequestHandler[];


    constructor(httpMthodType: HttpMethodType,
        executeFunction: Function,
        endPoint: ApiEndopointType,
        middlewares: RequestHandler[] = []
    ) {

        if (!endPoint) {
            throw Error(`エンドポイントが設定されていません。`);
        }

        this._httpMethodType = httpMthodType;
        this._executeFunction = executeFunction;
        this._endPoint = endPoint;
        this._middlewares = middlewares;
    }

    get httpMethodType() {
        return this._httpMethodType;
    }

    get executeFunction() {
        return this._executeFunction;
    }

    get endPoint() {
        return this._endPoint;
    }

    get middlewares() {
        return this._middlewares;
    }
}