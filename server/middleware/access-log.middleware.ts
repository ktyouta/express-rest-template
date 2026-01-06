import { Request } from 'express';
import { Logger } from '../logger/logger';


/**
 * コントローラーアクセス時のログ出力コントローラーアクセス時のログ出力
 * @param req 
 */
export function accessLogMiddleware(req: Request) {

    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const queryParams = JSON.stringify(req.query);
    const requestBody = JSON.stringify(req.body);
    // 出力内容
    const output = `${req.method} ${req.originalUrl} | User-Agent: ${userAgent} | Query: ${queryParams} | Request Body: ${requestBody} | ip: ${ip}`;

    // ログに出力
    Logger.info(output);
};