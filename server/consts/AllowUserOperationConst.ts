import { envConfig } from "./EnvConfig";

// ユーザー情報の更新制限フラグ
export const IS_ALLOW_USER_OPERATION = envConfig.allowUserOperation === `true`;