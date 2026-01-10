import { FrontUserId } from "../../../domain/frontuserid/front-user-id";
import { PrismaClientInstance } from "../../../infrastructure/prisma/prisma-client-instance";
import { FrontUserInfoType } from "../../../type/front-user.type";



/**
 * json形式の永続ロジック用クラス
 */
export class RefreshRepository {


    constructor() { }

    /**
     * ユーザー取得
     * @returns 
     */
    async select(frontUserId: FrontUserId):
        Promise<FrontUserInfoType[]> {

        // ユーザー情報を取得
        const frontUserList = await PrismaClientInstance.getInstance().$queryRaw<FrontUserInfoType[]>`
            SELECT 
                a.user_id as "userId",
                a.user_name as "userName",
                a.password as "password",
                b.user_birthday as "birthday"
            FROM "front_user_login_master" a 
            INNER JOIN "front_user_master" b
            ON a.user_id = CAST(${frontUserId.value} AS INTEGER) AND
            a.delete_flg = '0' AND
            a.user_id = b.user_id
        `;

        return frontUserList;
    }

}