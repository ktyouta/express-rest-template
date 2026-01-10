import { FrontUserMaster } from "@prisma/client";
import { AccessToken } from "../../../domain/accesstoken/access-token";
import { AuthUserInfoType } from "../../../type/auth-user.type";

export class FrontUserLoginResponseDto {

    private readonly _data: AuthUserInfoType;

    constructor(frontUserInfoMaster: FrontUserMaster,
        accessTokenModel: AccessToken,
    ) {

        this._data = {
            accessToken: accessTokenModel.token,
            user: {
                userId: frontUserInfoMaster.userId,
                userName: frontUserInfoMaster.userName,
                birthday: frontUserInfoMaster.userBirthday,
            }
        };
    }

    get data() {
        return this._data;
    }
}