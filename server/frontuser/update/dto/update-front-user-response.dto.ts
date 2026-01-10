import { FrontUserInfoType } from "../../../types/front-user.type";
import { FrontUserEntity } from "../entity/front-user.entity";

export class UpdateFrontUserResponseDto {

    // フロントユーザー情報
    private readonly _value: FrontUserInfoType;

    constructor(entity: FrontUserEntity) {

        this._value = {
            userId: entity.frontUserId,
            userName: entity.frontUserName,
            birthday: entity.frontUserBirthDay,
        }
    }

    get value() {
        return this._value;
    }
}