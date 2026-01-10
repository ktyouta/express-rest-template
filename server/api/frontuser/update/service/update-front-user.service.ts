import { Prisma } from "@prisma/client";
import { FrontUserId } from "../../../../domain/frontuserid/front-user-id";
import { FrontUserName } from "../../../../domain/frontusername/front-user-name";
import { FrontUserLoginEntity } from "../entity/front-user-login.entity";
import { FrontUserEntity } from "../entity/front-user.entity";
import { UpdateFrontUserRepository } from "../repository/update-front-user.repository";


export class UpdateFrontUserService {

    private readonly _repository = new UpdateFrontUserRepository();

    /**
     * ユーザー重複チェック
     * @param userNameModel 
     */
    async checkUserNameExists(userId: FrontUserId, userName: FrontUserName): Promise<boolean> {

        // ユーザー情報を取得
        const activeUserInfoMasterList = await this._repository.select(userId, userName);
        return activeUserInfoMasterList.length > 0;
    }

    /**
     * ユーザーログイン情報を更新
     * @param frontUserId 
     * @param userName 
     * @param userBirthDay 
     * @param tx 
     */
    async updateFrontLoginUser(entity: FrontUserLoginEntity, tx: Prisma.TransactionClient) {

        const result = await this._repository.updatetFrontLoginUser(entity, tx);
        return result;
    }

    /**
     * ユーザーを更新
     * @param frontUserId 
     * @param userName 
     * @param userBirthDay 
     * @param tx 
     */
    async updateFrontUser(entity: FrontUserEntity, tx: Prisma.TransactionClient) {

        const result = await this._repository.updateFrontUser(entity, tx);
        return result;
    }
}