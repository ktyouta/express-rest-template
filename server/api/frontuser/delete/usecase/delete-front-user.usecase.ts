import { Prisma } from "@prisma/client";
import { HTTP_STATUS } from "../../../../const/http-status.const";
import { FrontUserId } from "../../../../domain/frontuserid/front-user-id";
import { PrismaTransaction } from "../../../../infrastructure/prisma/prisma-transaction";
import { DeleteFrontUserService } from "../service/delete-front-user.service";


// 出力型
type Output = {
    status: number;
    message: string;
} & (
        {
            success: true;
        } |
        {
            success: false;
        }
    );

export class DeleteFrontUserUseCase {

    private readonly service: DeleteFrontUserService = new DeleteFrontUserService();

    constructor() { }

    async execute(userId: FrontUserId): Promise<Output> {

        const result = await PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // ユーザーログイン情報を削除する
            await this.service.deleteFrontLoginUser(userId, tx);

            // ユーザー情報を削除する
            await this.service.deleteFrontUser(userId, tx);

            return {
                success: true as const,
                status: HTTP_STATUS.NO_CONTENT,
                message: 'ユーザーの削除が完了しました。',
            };
        });

        return result;
    }
}
