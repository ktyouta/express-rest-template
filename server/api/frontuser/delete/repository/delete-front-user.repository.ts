import { FrontUserMaster, Prisma } from "@prisma/client";
import { FLG } from "../../../../const/flg.const";
import { FrontUserId } from "../../../../domain/frontuserid/front-user-id";
import { FrontUserName } from "../../../../domain/frontusername/front-user-name";
import { PrismaClientInstance } from "../../../../infrastructure/prisma/prisma-client-instance";


/**
 * json形式の永続ロジック用クラス
 */
export class DeleteFrontUserRepository {

    constructor() {
    }

    /**
     * ユーザー取得
     * @returns 
     */
    async select(userId: FrontUserId, userName: FrontUserName): Promise<FrontUserMaster[]> {

        const result = await PrismaClientInstance.getInstance().frontUserMaster.findMany({
            where: {
                userName: userName.value,
                userId: {
                    not: userId.value
                },
                deleteFlg: FLG.OFF,
            }
        });

        return result;
    }

    /**
     * フロントのユーザー情報を更新
     */
    async deletetFrontUser(userId: FrontUserId, tx: Prisma.TransactionClient) {

        const result = tx.frontUserMaster.update({
            where: { userId: userId.value },
            data: {
                updateDate: new Date(),
                lastLoginDate: new Date(),
                deleteFlg: FLG.ON,
            },
        });

        return result;
    }

    /**
     * フロントのユーザーログイン情報を更新
     */
    async deleteFrontLoginUser(userId: FrontUserId, tx: Prisma.TransactionClient) {

        const result = tx.frontUserLoginMaster.update({
            where: { userId: userId.value },
            data: {
                updateDate: new Date(),
                deleteFlg: FLG.ON,
            },
        });

        return result;
    }
}