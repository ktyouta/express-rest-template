import { CreateFrontUserController } from "../frontuser/create/controller/create-front-user.controller";
import { DeleteFrontUserController } from "../frontuser/delete/controller/delete-front-user.controller";
import { UpdateFrontUserController } from "../frontuser/update/controller/update-front-user.controller";
import { FrontUserLoginController } from "../frontuserlogin/controller/front-user-login.controller";
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
    // ユーザー更新
    new UpdateFrontUserController(),
    // ユーザー削除
    new DeleteFrontUserController(),
    // ログイン
    new FrontUserLoginController(),
];