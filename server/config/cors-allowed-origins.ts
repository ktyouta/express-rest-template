import { envConfig } from "./env.config";

const corsProtocol = envConfig.corsProtocol ?? ``;
const corsDomain = envConfig.corsDomain ?? ``;
const corsPort = envConfig.corsPort ?? ``;
const corsOrigin = `${corsProtocol}${corsDomain}${corsPort}`;

// 認証許可オリジン
export const AUTH_ALLOWED_ORIGINS = [
    corsOrigin
];