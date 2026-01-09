import { FrontUserMaster, Prisma } from "@prisma/client";
import { FLG } from "../../../consts/flg.const";
import { PrismaClientInstance } from "../../../infrastructure/prisma/prisma-client-instance";
import { FrontUserName } from "../../domain/front-user-name";
import { FrontUserLoginEntity } from "../entity/front-user-login.entity";
import { FrontUserEntity } from "../entity/front-user.entity";


/**
 * json形式の永続ロジック用クラス
 */
export class CreateFrontUserRepository {

    constructor() {
    }

    /**
     * ユーザー取得
     * @returns 
     */
    async select(userName: FrontUserName): Promise<FrontUserMaster[]> {

        const result = await PrismaClientInstance.getInstance().frontUserMaster.findMany({
            where: {
                userName: userName.value,
                deleteFlg: FLG.OFF,
            }
        });

        return result;
    }

    /**
     * フロントのユーザー情報を作成
     */
    async insertFrontUser(entity: FrontUserEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = entity.frontUserId;
        const userName = entity.frontUserName;
        const userBirthday = entity.frontUserBirthDay;

        const newUserInfo = await tx.frontUserMaster.create({
            data: {
                userId,
                userName,
                userBirthday,
                createDate: new Date(),
                updateDate: new Date(),
                deleteFlg: FLG.OFF,
            },
        });

        return newUserInfo;
    }

    /**
     * フロントのユーザーログイン情報を作成
     */
    async insertFrontLoginUser(entity: FrontUserLoginEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = entity.frontUserId;
        const password = entity.frontUserPassword;
        const salt = entity.salt;
        const userName = entity.frontUserName;

        const result = tx.frontUserLoginMaster.create({
            data: {
                userId,
                password,
                salt,
                createDate: new Date(),
                updateDate: new Date(),
                deleteFlg: FLG.OFF,
                userName,
            },
        });

        return result;
    }
}