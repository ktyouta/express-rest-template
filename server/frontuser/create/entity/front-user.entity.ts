import { FrontUserId } from "../../../domain/frontuserid/front-user-id";
import { FrontUserBirthday } from "../../domain/front-user-birthday";
import { FrontUserName } from "../../domain/front-user-name";


export class FrontUserEntity {

    // ユーザーID
    private readonly _frontUserId: FrontUserId;
    // ユーザー名
    private readonly _frontUserName: FrontUserName;
    // ユーザー生年月日
    private readonly _frontUserBirthDay: FrontUserBirthday;


    constructor(userId: FrontUserId,
        userName: FrontUserName,
        userBirthDay: FrontUserBirthday,
    ) {

        this._frontUserId = userId;
        this._frontUserName = userName;
        this._frontUserBirthDay = userBirthDay;
    }

    get frontUserId() {
        return this._frontUserId.value;
    }

    get frontUserName() {
        return this._frontUserName.value;
    }

    get frontUserBirthDay() {
        return this._frontUserBirthDay.value;
    }

}