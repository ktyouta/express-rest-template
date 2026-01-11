import { Prisma } from "@prisma/client";
import { HTTP_STATUS } from "../../../../const/http-status.const";
import { FrontUserId } from "../../../../domain/frontuserid/front-user-id";
import { FrontUserName } from "../../../../domain/frontusername/front-user-name";
import { RefreshToken } from "../../../../domain/refreshtoken/refresh-token";
import { PrismaTransaction } from "../../../../infrastructure/prisma/prisma-transaction";
import { FrontUserInfoType } from "../../../../type/front-user.type";
import { FrontUserBirthday } from "../../domain/front-user-birthday";
import { UpdateFrontUserResponseDto } from "../dto/update-front-user-response.dto";
import { FrontUserLoginEntity } from "../entity/front-user-login.entity";
import { FrontUserEntity } from "../entity/front-user.entity";
import { RequestBodySchemaType } from "../schema/request-body.schema";
import { UpdateFrontUserService } from "../service/update-front-user.service";

// 入力型
type Input = {
    userId: FrontUserId;
    requestBody: RequestBodySchemaType;
};

// 出力型
type Output = {
    status: number;
    message: string;
} & (
        {
            success: true;
            data: {
                response: FrontUserInfoType;
                refreshToken: string;
            };
        } |
        {
            success: false;
        }
    );

export class UpdateFrontUserUseCase {

    private readonly service: UpdateFrontUserService = new UpdateFrontUserService();

    constructor() { }

    async execute(userId: FrontUserId, requestBody: RequestBodySchemaType): Promise<Output> {

        const result = await PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            const userName = new FrontUserName(requestBody.userName);
            const userBirthDay = new FrontUserBirthday(requestBody.userBirthday);

            // ユーザーの存在チェック
            if (await this.service.checkUserNameExists(userId, userName)) {
                return {
                    success: false as const,
                    status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                    message: '既にユーザーが存在しています。',
                };
            }

            // ユーザーログイン情報を更新する
            const loginUserEntity = new FrontUserLoginEntity(
                userId,
                userName,
            );

            await this.service.updateFrontLoginUser(loginUserEntity, tx);

            // ユーザー情報を更新する
            const frontUserEntity = new FrontUserEntity(
                userId,
                userName,
                userBirthDay
            );

            await this.service.updateFrontUser(frontUserEntity, tx);

            // リフレッシュトークンを発行
            const refreshToken = RefreshToken.create(userId);

            // レスポンスを作成
            const responseDto = new UpdateFrontUserResponseDto(frontUserEntity);

            return {
                success: true as const,
                status: HTTP_STATUS.CREATED,
                message: 'ユーザー情報の更新が完了しました。',
                data: {
                    response: responseDto.value,
                    refreshToken: refreshToken.value,
                },
            };
        });

        return result;
    }
}
