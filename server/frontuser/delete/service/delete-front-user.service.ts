import { Prisma } from "@prisma/client";
import { FrontUserId } from "../../../domain/frontuserid/front-user-id";
import { DeleteFrontUserRepository } from "../repository/delete-front-user.repository";


export class DeleteFrontUserService {

    private readonly _repository = new DeleteFrontUserRepository();

    /**
     * ユーザーログイン情報を削除
     * @param frontUserId 
     * @param userName 
     * @param userBirthDay 
     * @param tx 
     */
    async deleteFrontLoginUser(userId: FrontUserId, tx: Prisma.TransactionClient) {

        const result = await this._repository.deletetFrontLoginUser(userId, tx);
        return result;
    }

    /**
     * ユーザーを削除
     * @param frontUserId 
     * @param userName 
     * @param userBirthDay 
     * @param tx 
     */
    async deleteFrontUser(userId: FrontUserId, tx: Prisma.TransactionClient) {

        const result = await this._repository.deletetFrontUser(userId, tx);
        return result;
    }
}