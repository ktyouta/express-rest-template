type seqType = 'front_user_id';

export class SeqKey {

    private readonly _value: string;

    constructor(key: seqType) {

        if (!key) {
            throw Error(`シーケンスのキーが設定されていません。`);
        }

        this._value = key;
    }

    get value() {
        return this._value;
    }
}