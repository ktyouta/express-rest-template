import { Prisma } from "@prisma/client";
import { FrontUserId } from "../../../../domain/frontuserid/front-user-id";
import { FrontUserName } from "../../../../domain/frontusername/front-user-name";
import { SeqIssue } from "../../../../domain/seq/seq-issue";
import { SeqKey } from "../../../../domain/seq/seq-key";
import { FrontUserLoginEntity } from "../entity/front-user-login.entity";
import { FrontUserEntity } from "../entity/front-user.entity";
import { CreateFrontUserRepository } from "../repository/create-front-user.repository";


export class CreateFrontUserService {

    private readonly _repository = new CreateFrontUserRepository();
    private static readonly SEQ_KEY = `front_user_id`;

    /**
     * ユーザー重複チェック
     * @param userNameModel 
     */
    async checkUserNameExists(userName: FrontUserName): Promise<boolean> {

        // ユーザー情報を取得
        const result = await this._repository.select(userName);
        return result.length > 0;
    }

    /**
     * ユーザーIDを発番
     * @param tx 
     */
    async createUserId(tx: Prisma.TransactionClient) {

        const keyModel = new SeqKey(CreateFrontUserService.SEQ_KEY);
        const newId = await SeqIssue.get(keyModel, tx);

        return FrontUserId.of(newId);
    }

    /**
     * ユーザーログイン情報を作成
     * @param frontUserId 
     * @param userName 
     * @param userBirthDay 
     * @param tx 
     */
    async insertFrontLoginUser(entity: FrontUserLoginEntity, tx: Prisma.TransactionClient) {

        const result = await this._repository.insertFrontLoginUser(entity, tx);
        return result;
    }

    /**
     * ユーザーを作成
     * @param frontUserId 
     * @param userName 
     * @param userBirthDay 
     * @param tx 
     */
    async insertFrontUser(entity: FrontUserEntity, tx: Prisma.TransactionClient) {

        const result = await this._repository.insertFrontUser(entity, tx);
        return result;
    }
}