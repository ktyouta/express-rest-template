import bodyParser from 'body-parser';
import { NextFunction, Request, Response } from 'express';
import { envConfig } from './config/env.config';
import { HTTP_STATUS } from './const/http-status.const';
import { logConfig } from './logger/log-config';
import { accessLogMiddleware } from './middleware/access-log.middleware';
import { errorLogMiddleware } from './middleware/error-log.middleware';
import { ROUTE_CONTROLLER_LIST } from './router/route-controller-list';


const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");

async function bootstrap() {

    // ログの初期化
    await logConfig();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());

    const corsProtocol = envConfig.corsProtocol;
    const corsDomain = envConfig.corsDomain;
    const corsPort = envConfig.corsPort;

    // プロキシ信頼設定
    app.set('trust proxy', 1);

    // cors設定
    app.use(cors({
        origin: `${corsProtocol}${corsDomain}${corsPort}`,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: [
            "Origin",
            "X-Requested-With",
            "Content-Type",
            "Accept",
            "Authorization",
            "X-CSRF-Token"
        ]
    }));

    //コントローラーアクセス時のログ出力
    app.use((req: Request, res: Response, next: NextFunction) => {

        // アクセスログを出力
        accessLogMiddleware(req);

        next();
    });

    // コントローラーのルートを設定
    ROUTE_CONTROLLER_LIST.forEach((e) => {
        app.use('/', e.router);
    });

    // エラー時共通処理
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

        // コンソールログ出力
        console.error(`Error occurred in API : ${err.message}`);

        // エラーログ出力
        errorLogMiddleware(err, req);

        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
            message: "予期しないエラーが発生しました。",
        });
    });

    // サーバーを起動
    app.listen(envConfig.port, () => {
        console.log(`API Server listening on port ${envConfig.port}`);
    });
}

// エラーハンドリング
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

bootstrap();