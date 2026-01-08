export class FrontUserBirthday {

    private readonly _value: string;

    constructor(userBirthDay: string) {

        // 正規表現チェック
        if (!this.checkFormat(userBirthDay)) {
            throw Error("ユーザーの誕生日のフォーマットが不正です。");
        }

        // 日付の妥当性チェック
        if (!this.chechDateValid(userBirthDay)) {
            throw Error("ユーザーの誕生日が正しくありません。");
        }

        this._value = userBirthDay;
    }

    /**
     * getter
     */
    get value() {
        return this._value;
    }


    /**
     * 引数の日付に対する正規表現チェック(yyyyMMDD)
     * @param userBirthDay 
     * @returns 
     */
    private checkFormat(userBirthDay: string) {

        // yyyyMMDD形式チェック
        const regex = /^[0-9]{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;

        return regex.test(userBirthDay);
    }


    /**
     * 引数の日付の妥当性チェック
     * @param userBirthDay 
     */
    private chechDateValid(userBirthDay: string) {

        const year = parseInt(userBirthDay.substring(0, 4), 10);
        const month = parseInt(userBirthDay.substring(4, 6)) - 1;
        const day = parseInt(userBirthDay.substring(6, 8), 10);

        const date = new Date(year, month, day);

        return year === date.getFullYear() && month === date.getMonth() && day === date.getDate();
    }
}