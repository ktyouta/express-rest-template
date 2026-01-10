import { FrontUserId } from '../../../domain/frontuserid/front-user-id';
import { RefreshRepository } from '../repository/refresh.repository';


export class RefreshService {

    private readonly _respository: RefreshRepository = new RefreshRepository();

    constructor() { }

    /**
     * ユーザー情報を取得
     * @param userIdModel 
     */
    async getUser(userIdModel: FrontUserId) {

        const frontUserLoginList = await this._respository.select(userIdModel);

        return frontUserLoginList;
    }
}