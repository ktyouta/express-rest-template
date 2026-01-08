import { Prisma } from "@prisma/client";
import { FLG } from "../../../consts/flg.const";
import { FrontUserEntity } from "../entity/front-user.entity";


/**
 * json形式の永続ロジック用クラス
 */
export class CreateFrontUserRepository {

    constructor() {
    }

    /**
     * フロントのユーザー情報を作成
     */
    async insert(entity: FrontUserEntity,
        tx: Prisma.TransactionClient
    ) {

        const userId = entity.frontUserId;
        const userName = entity.frontUserName;
        const userBirthday = entity.frontUserBirthDay;

        const newUserInfo = await tx.frontUserInfoMaster.create({
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
}