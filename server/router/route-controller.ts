import { IRouterMatcher, Router } from "express";
import { AsyncErrorMiddleware } from "../middleware/async-error.middleware";
import { HTTP_METHOD, HttpMethodType } from "./http-method.type";
import { RouteSettingModel } from "./route-setting-model";

export abstract class RouteController {

    router: Router;

    constructor() {
        this.router = Router();

        const methods: Record<HttpMethodType, IRouterMatcher<Router>> = {
            [HTTP_METHOD.GET]: this.router.get.bind(this.router),
            [HTTP_METHOD.POST]: this.router.post.bind(this.router),
            [HTTP_METHOD.PUT]: this.router.put.bind(this.router),
            [HTTP_METHOD.DELETE]: this.router.delete.bind(this.router),
        }

        const routeSettingModel: RouteSettingModel = this.getRouteSettingModel();
        const httpMethodType = routeSettingModel.httpMethodType;
        const endPoint = routeSettingModel.endPoint;
        const executeFunction = routeSettingModel.executeFunction;
        const middlewares = routeSettingModel.middlewares;
        const httpMethod = methods[httpMethodType];

        httpMethod(endPoint, ...middlewares, AsyncErrorMiddleware(executeFunction.bind(this)));
    }

    protected abstract getRouteSettingModel(): RouteSettingModel;
}