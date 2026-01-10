import { FrontUserMaster } from "@prisma/client";
import { FrontUserId } from "../../domain/frontuserid/front-user-id";
import { AuthRepository } from "../repository/auth.repository";


export class AuthService {

    private readonly _repository = new AuthRepository();

    /**
     * ユーザー重複チェック
     * @param userNameModel 
     */
    async select(userId: FrontUserId): Promise<FrontUserMaster[]> {

        // ユーザー情報を取得
        const result = await this._repository.select(userId);

        return result;
    }
}