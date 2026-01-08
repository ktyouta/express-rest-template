export class FrontUserName {

    private readonly _value: string;

    constructor(userName: string) {

        this._value = userName;
    }

    public get value() {
        return this._value;
    }

    /**
     * ユーザー名の同一チェック
     * @param userNameModel 
     * @returns 
     */
    public checkUsernameDuplicate(userNameModel: FrontUserName) {

        return this._value === userNameModel.value;
    }
}