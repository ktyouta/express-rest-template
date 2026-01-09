import { CreateFrontUserController } from "../frontuser/create/controller/create-front-user.controller";
import { HealthController } from "../health/controller/health.controller";
import { RefreshController } from "../refresh/controller/refresh.controller";
import { RouteController } from "./route-controller";

/**
 * ルーティングリスト
 */
export const ROUTE_CONTROLLER_LIST: ReadonlyArray<RouteController> = [
    // ヘルスチェック
    new HealthController(),
    // リフレッシュ
    new RefreshController(),
    // ユーザー作成
    new CreateFrontUserController(),
];