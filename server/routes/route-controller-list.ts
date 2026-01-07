import { HealthController } from "../health/controllers/health.controller";
import { RouteController } from "./route-controller";

/**
 * ルーティングリスト
 */
export const ROUTE_CONTROLLER_LIST: ReadonlyArray<RouteController> = [
    // ヘルスチェック
    new HealthController(),
];