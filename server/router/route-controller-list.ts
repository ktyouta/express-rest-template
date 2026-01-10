import { CreateFrontUserController } from "../api/frontuser/create/controller/create-front-user.controller";
import { DeleteFrontUserController } from "../api/frontuser/delete/controller/delete-front-user.controller";
import { UpdateFrontUserController } from "../api/frontuser/update/controller/update-front-user.controller";
import { FrontUserLoginController } from "../api/frontuserlogin/controller/front-user-login.controller";
import { HealthController } from "../api/health/controller/health.controller";
import { RefreshController } from "../api/refresh/controller/refresh.controller";
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
    // ユーザー更新
    new UpdateFrontUserController(),
    // ユーザー削除
    new DeleteFrontUserController(),
    // ログイン
    new FrontUserLoginController(),
];