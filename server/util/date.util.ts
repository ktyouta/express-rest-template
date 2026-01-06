
type DateFormat = 'yyyy-MM-dd HH:mm:ss' | 'yyyy/MM/dd' | 'HH:mm:ss' | 'dd-MM-yyyy HH:mm' | 'yyyyMMdd';

export class DateUtil {


    /**
     * 現在日時を取得
     * @returns 
     */
    public static getNowDatetime(format: DateFormat) {

        return this.getFormatDatetime(new Date(), format);
    }


    /**
     * 日付をフォーマット変換する
     * @param date 
     * @param format 
     * @returns 
     */
    public static getFormatDatetime(date: Date, format: DateFormat): string {

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = (date.getDate()).toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        let retDate = "";

        if (format === 'yyyyMMdd') {

            retDate = `${year}${month}${day}`;
        }
        else {

            retDate = format.replace('yyyy', String(year))
                .replace('MM', String(month).padStart(2, '0'))
                .replace('dd', String(day).padStart(2, '0'))
                .replace('HH', String(hours).padStart(2, '0'))
                .replace('mm', String(minutes).padStart(2, '0'))
                .replace('ss', String(seconds).padStart(2, '0'));
        }

        return retDate;
    }


    /**
     * 現在日付(yyyyMMdd)を取得する
     * @param format 
     * @returns 
     */
    public static getNowDateYYYYMMDD() {

        return this.getFormatDatetime(new Date(), 'yyyyMMdd');
    }

}