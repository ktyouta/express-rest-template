import { configure, getConsoleSink, withFilter } from "@logtape/logtape";
import { ERROR_LOG_FILE, INFO_LOG_FILE, LOG_FILE_PATH, WARN_LOG_FILE } from "../consts/file-info.const";
import { File } from "../infrastructure/file/file";
import { DateUtil } from "../util/date.util";

export async function logConfig() {
    await configure({
        sinks: {

            // info,debugはコンソールに出力しない
            console: withFilter(getConsoleSink(), (record) => {
                return record.level !== "info" && record.level !== "debug";
            }),

            file: (record) => {

                const timestamp = DateUtil.getNowDatetime('yyyy-MM-dd HH:mm:ss');
                const messageText = record.message.join(' ');
                const output = `[${timestamp}] [${record.level.toUpperCase()}] ${messageText}\n`;

                if (record.level === 'info') {
                    File.append(`${LOG_FILE_PATH}${INFO_LOG_FILE}`, output);
                }
                else if (record.level === 'warning') {
                    File.append(`${LOG_FILE_PATH}${WARN_LOG_FILE}`, output);
                }
                else if (record.level === 'error') {
                    File.append(`${LOG_FILE_PATH}${ERROR_LOG_FILE}`, output);
                }
            }
        },
        loggers: [
            {
                category: ["app"],
                sinks: ["file", "console"],
                lowestLevel: "info",
            },
            {
                category: ["logtape"],
                sinks: ["console"],
                lowestLevel: "warning",
            }
        ],
    });
}