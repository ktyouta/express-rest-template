export class FrontUserName {

    private readonly _value: string;

    constructor(userName: string) {

        this._value = userName;
    }

    get value() {
        return this._value;
    }

    /**
     * ユーザー名の同一チェック
     * @param userNameModel 
     * @returns 
     */
    checkUsernameDuplicate(userNameModel: FrontUserName) {

        return this._value === userNameModel.value;
    }
}