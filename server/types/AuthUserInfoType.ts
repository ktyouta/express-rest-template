import { FrontUserInfoType } from "./FrontUserInfoType"

// 認証用ユーザー情報
export type AuthUserInfoType = {
    accessToken: string,
    userInfo: FrontUserInfoType,
}