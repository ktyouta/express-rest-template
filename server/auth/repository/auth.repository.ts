import { FrontUserMaster } from "@prisma/client";
import { FLG } from "../../consts/flg.const";
import { FrontUserId } from "../../domain/frontuserid/front-user-id";
import { PrismaClientInstance } from "../../infrastructure/prisma/prisma-client-instance";


/**
 * json形式の永続ロジック用クラス
 */
export class AuthRepository {

    constructor() {
    }

    /**
     * ユーザー取得
     * @returns 
     */
    async select(userId: FrontUserId): Promise<FrontUserMaster[]> {

        const result = await PrismaClientInstance.getInstance().frontUserMaster.findMany({
            where: {
                userId: userId.value,
                deleteFlg: FLG.OFF,
            }
        });

        return result;
    }
}