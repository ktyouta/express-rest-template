import { FrontUserInfoType } from "./front-user.type"

// 認証用ユーザー情報
export type AuthUserInfoType = {
    accessToken: string,
    user: FrontUserInfoType,
}