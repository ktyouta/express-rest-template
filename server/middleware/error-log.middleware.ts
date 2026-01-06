import { Request } from 'express';
import { Logger } from '../logger/logger';


/**
 * エラー時のログ出力
 * @param err 
 * @param req 
 */
export function errorLogMiddleware(
    err: Error,
    req: Request,
) {

    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const queryParams = JSON.stringify(req.query);
    const requestBody = JSON.stringify(req.body);
    // 出力内容
    const output = `${req.method} ${req.originalUrl} | User-Agent: ${userAgent} | Query: ${queryParams} | Request Body: ${requestBody} | ip: ${ip} | ERROR: ${err}`;

    // エラーログに出力
    Logger.error(output);
};