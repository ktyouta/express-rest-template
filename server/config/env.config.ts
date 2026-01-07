import dotenv from "dotenv";

dotenv.config();

export const envConfig = {
    databaseUrl: process.env.DATABASE_URL || ``,
    youtubeApiKey: process.env.YOUTUBE_API_KEY || ``,
    port: process.env.PORT || ``,
    corsProtocol: process.env.CORS_PROTOCOL || ``,
    corsDomain: process.env.CORS_DOMAIN || ``,
    corsPort: process.env.CORS_PORT || ``,
    timeout: process.env.TIMEOUT || ``,
    allowUserOperation: process.env.ALLOW_USER_OPERATION || ``,
    envProduction: process.env.ENV_PRODUCTION || ``,
    refreshTokenJwtKey: process.env.REFRESH_TOKEN_JWT_KEY || ``,
    refreshTokenExpires: process.env.REFRESH_TOKEN_EXPIRES || ``,
    accessTokenJwtKey: process.env.ACCESS_TOKEN_JWT_KEY || ``,
    accessTokenExpires: process.env.ACCESS_TOKEN_EXPIRES || ``,
    pepper: process.env.PEPPER || ``,
};