import { FrontUserId } from "../../../domain/frontuserid/front-user-id";
import { FrontUserName } from "../../domain/front-user-name";


export class FrontUserLoginEntity {

    // ユーザーID
    private readonly _frontUserId: FrontUserId;
    // ユーザー名
    private readonly _frontUserName: FrontUserName;

    constructor(userId: FrontUserId, frontUserName: FrontUserName) {

        this._frontUserId = userId;
        this._frontUserName = frontUserName;
    }

    get frontUserId() {
        return this._frontUserId.value;
    }

    get frontUserName() {
        return this._frontUserName.value;
    }
}