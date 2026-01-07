import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../../consts/http-status.const';
import { ApiEndopoint } from '../../routes/api-endpoint.const';
import { HTTP_METHOD } from '../../routes/http-method.type';
import { RouteController } from '../../routes/route-controller';
import { RouteSettingModel } from '../../routes/route-setting.model';
import { ApiResponse } from '../../util/api-response';
import { DateUtil } from '../../util/date.util';


export class HealthController extends RouteController {

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HTTP_METHOD.GET,
            this.doExecute,
            ApiEndopoint.HEALTH
        );
    }

    /**
     * ヘルスチェック
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        const nowDate = DateUtil.getNowDatetime(`yyyy-MM-dd HH:mm:ss`);

        return ApiResponse.create(res, HTTP_STATUS.OK, `service is running`, nowDate);
    }
}