import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../../const/http-status.const';
import { API_ENDPOINT } from '../../router/api-endpoint.const';
import { HTTP_METHOD } from '../../router/http-method.type';
import { RouteController } from '../../router/route-controller';
import { RouteSettingModel } from '../../router/route-setting.model';
import { ApiResponse } from '../../util/api-response';
import { DateUtil } from '../../util/date.util';


export class HealthController extends RouteController {

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HTTP_METHOD.GET,
            this.doExecute,
            API_ENDPOINT.HEALTH
        );
    }

    /**
     * ヘルスチェック
     * @param req 
     * @param res 
     * @returns 
     */
    async doExecute(req: Request, res: Response, next: NextFunction) {

        const nowDate = DateUtil.getNowDatetime(`yyyy-MM-dd HH:mm:ss`);

        return ApiResponse.create(res, HTTP_STATUS.OK, `service is running`, nowDate);
    }
}