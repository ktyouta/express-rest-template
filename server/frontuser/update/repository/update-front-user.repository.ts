import { FrontUserMaster, Prisma } from "@prisma/client";
import { FLG } from "../../../consts/flg.const";
import { FrontUserId } from "../../../domain/frontuserid/front-user-id";
import { PrismaClientInstance } from "../../../infrastructure/prisma/prisma-client-instance";
import { FrontUserName } from "../../domain/front-user-name";
import { FrontUserLoginEntity } from "../entity/front-user-login.entity";
import { FrontUserEntity } from "../entity/front-user.entity";


/**
 * json形式の永続ロジック用クラス
 */
export class UpdateFrontUserRepository {

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
    async updatetFrontUser(entity: FrontUserEntity, tx: Prisma.TransactionClient) {

        const userId = entity.frontUserId;
        const userName = entity.frontUserName;
        const userBirthday = entity.frontUserBirthDay;

        const result = tx.frontUserMaster.update({
            where: { userId },
            data: {
                userName,
                userBirthday,
                updateDate: new Date(),
                lastLoginDate: new Date(),
            },
        });

        return result;
    }

    /**
     * フロントのユーザーログイン情報を更新
     */
    async updatetFrontLoginUser(entity: FrontUserLoginEntity, tx: Prisma.TransactionClient) {

        const userId = entity.frontUserId;
        const userName = entity.frontUserName;

        const result = tx.frontUserLoginMaster.update({
            where: { userId },
            data: {
                userName,
                updateDate: new Date(),
            },
        });

        return result;
    }
}