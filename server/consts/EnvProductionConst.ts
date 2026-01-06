import { envConfig } from "./EnvConfig";

// 環境フラグ
export const IS_ENV_PRODUCTION = envConfig.envProduction === `true`;