import { Response } from 'express';


export class ApiResponse {

    /**
     * restapiのレスポンスを作成する
     * @param res 
     * @param status 
     * @param message 
     * @param data 
     * @returns 
     */
    public static create<T>(res: Response, status: number, message: string, data?: T) {

        return res.status(status).json({
            status: status,
            message: message,
            data: data,
        });
    }
}