import { AccessToken } from "../../../../domain/accesstoken/access-token";
import { AuthUserInfoType } from "../../../../type/auth-user.type";
import { FrontUserEntity } from "../entity/front-user.entity";

export class CreateFrontUserResponseDto {

    // フロントユーザー情報
    private readonly _value: AuthUserInfoType;

    constructor(entity: FrontUserEntity, accessToken: AccessToken) {

        this._value = {
            accessToken: accessToken.token,
            user: {
                userId: entity.frontUserId,
                userName: entity.frontUserName,
                birthday: entity.frontUserBirthDay,
            }
        }
    }

    get value() {
        return this._value;
    }
}