import { Prisma } from "@prisma/client";
import { HTTP_STATUS } from "../../../../const/http-status.const";
import { AccessToken } from "../../../../domain/accesstoken/access-token";
import { FrontUserName } from "../../../../domain/frontusername/front-user-name";
import { FrontUserPassword } from "../../../../domain/frontuserpassword/front-user-password";
import { FrontUserSalt } from "../../../../domain/frontusersalt/front-user-salt";
import { Pepper } from "../../../../domain/pepper/pepper";
import { RefreshToken } from "../../../../domain/refreshtoken/refresh-token";
import { PrismaTransaction } from "../../../../infrastructure/prisma/prisma-transaction";
import { AuthUserInfoType } from "../../../../type/auth-user.type";
import { FrontUserBirthday } from "../../domain/front-user-birthday";
import { CreateFrontUserResponseDto } from "../dto/create-front-user-response.dto";
import { FrontUserLoginEntity } from "../entity/front-user-login.entity";
import { FrontUserEntity } from "../entity/front-user.entity";
import { RequestBodySchemaType } from "../schema/request-body.schema";
import { CreateFrontUserService } from "../service/create-front-user.service";

// 出力型
type Output = {
    status: number;
    message: string;
} & (
        {
            success: true;
            data: {
                response: AuthUserInfoType;
                refreshToken: string;
            };
        } |
        {
            success: false;
        }
    );

export class CreateFrontUserUseCase {

    private readonly service: CreateFrontUserService = new CreateFrontUserService();

    constructor() { }

    async execute(requestBody: RequestBodySchemaType): Promise<Output> {

        const result = await PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            const userName = new FrontUserName(requestBody.userName);
            const userBirthDay = new FrontUserBirthday(requestBody.userBirthday);
            const salt = FrontUserSalt.generate();
            const pepper = new Pepper();
            const userPassword = FrontUserPassword.hash(requestBody.password, salt, pepper);

            // ユーザー重複チェック
            if (await this.service.checkUserNameExists(userName)) {
                return {
                    success: false as const,
                    status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
                    message: '既にユーザーが存在しています。',
                };
            }

            // ユーザーIDを採番する
            const frontUserId = await this.service.createUserId(tx);

            // ユーザーログイン情報を追加する
            const loginUserEntity = new FrontUserLoginEntity(
                frontUserId,
                userName,
                userPassword,
                salt,
            );

            await this.service.insertFrontLoginUser(loginUserEntity, tx);

            // ユーザー情報を追加する
            const userEntity = new FrontUserEntity(
                frontUserId,
                userName,
                userBirthDay
            );

            await this.service.insertFrontUser(userEntity, tx);

            // アクセストークンを発行
            const accessToken = AccessToken.create(frontUserId);

            // リフレッシュトークンを発行
            const refreshToken = RefreshToken.create(frontUserId);

            // レスポンスを作成
            const responseDto = new CreateFrontUserResponseDto(userEntity, accessToken);

            return {
                success: true as const,
                status: HTTP_STATUS.CREATED,
                message: 'ユーザー情報の登録が完了しました。',
                data: {
                    response: responseDto.value,
                    refreshToken: refreshToken.value,
                },
            };
        });

        return result;
    }
}
