import { Prisma } from '@prisma/client';
import { FrontUserId } from '../../../domain/frontuserid/front-user-id';
import { FrontUserName } from '../../../domain/frontusername/front-user-name';
import { FrontUserLoginRepository } from '../repository/front-user-login.repository';


export class FrontUserLoginService {

    private readonly repository: FrontUserLoginRepository = new FrontUserLoginRepository();

    constructor() { }

    /**
     * ログインユーザーを取得
     * @param frontUserLoginRequestBody 
     */
    async getLoginUser(userName: FrontUserName) {

        const frontUserLoginList = await this.repository.selectLoginUser(userName);
        return frontUserLoginList;
    }

    /**
     * ユーザーを情報
     * @param frontUserLoginRequestBody 
     */
    async getUserInfo(userId: FrontUserId) {

        const frontUserList = await this.repository.selectUserInfo(userId);
        return frontUserList;
    }

    /**
     * ユーザーの最終ログイン日時を更新する
     * @param frontUserId 
     * @param tx 
     */
    async updateLastLoginDate(frontUserId: FrontUserId, tx: Prisma.TransactionClient) {

        const frontUser = await this.repository.updateLastLoginDate(frontUserId, tx);
        return frontUser;
    }
}