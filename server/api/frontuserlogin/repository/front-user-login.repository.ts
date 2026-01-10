import { FrontUserLoginMaster, FrontUserMaster, Prisma } from "@prisma/client";
import { FrontUserId } from "../../../domain/frontuserid/front-user-id";
import { FrontUserName } from "../../../domain/frontusername/front-user-name";
import { PrismaClientInstance } from "../../../infrastructure/prisma/prisma-client-instance";


/**
 * json形式の永続ロジック用クラス
 */
export class FrontUserLoginRepository {

    constructor() {
    }

    /**
     * ログイン情報を取得
     * @returns 
     */
    async selectLoginUser(userName: FrontUserName) {

        const frontUserList = await PrismaClientInstance.getInstance().$queryRaw<FrontUserLoginMaster[]>`
                    SELECT 
                        user_id as "userId",
                        salt,
                        password
                    FROM "front_user_login_master" 
                    WHERE "user_name" = ${userName.value} AND
                    "delete_flg" = '0'
                    `;

        return frontUserList;
    }

    /**
     * ユーザー情報を取得
     * @returns 
     */
    async selectUserInfo(frontUserId: FrontUserId) {

        const frontUserList = await PrismaClientInstance.getInstance().$queryRaw<FrontUserMaster[]>`
                    SELECT 
                        user_id as "userId",
                        user_name as "userName",
                        user_birthday as "userBirthday"
                    FROM 
                        "front_user_info_master" 
                    WHERE 
                        "user_id" = CAST(${frontUserId.value} AS INTEGER) AND
                        "delete_flg" = '0'
                    `;

        return frontUserList;
    }

    /**
     * ユーザーの最終ログイン日時を更新
     * @param frontUserInfoUpdateLastLoginDateEntity 
     * @param tx 
     * @returns 
     */
    async updateLastLoginDate(frontUserId: FrontUserId, tx: Prisma.TransactionClient) {

        const userInfo = await tx.frontUserMaster.update({
            where: { userId: frontUserId.value },
            data: {
                updateDate: new Date(),
                lastLoginDate: new Date(),
            },
        });

        return userInfo;
    }
}