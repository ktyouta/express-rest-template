import { getLogger } from "@logtape/logtape";

const lt = getLogger(["app"]);

export class Logger {

    /**
     * 通常ログ
     */
    static info(message: string) {
        lt.info`${message}`;
    }

    /**
     * 警告ログ
     */
    static warn(message: string) {
        lt.warn`${message}`;
    }

    /**
     * エラーログ
     */
    static error(message: string) {
        lt.error`${message}`;
    }
}