import { z } from "zod";

// ユーザー情報更新時のリクエストのバリデーションチェック用
export const RequestBodySchema = z.object({
    userName: z.string().min(3, "ユーザー名は3文字以上で入力してください。").max(30, "ユーザー名は30文字以内で入力してください。"),
    userBirthday: z.string().regex(/^[0-9]{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/, "生年月日は日付形式(yyyyMMdd)である必要があります"),
});

export type RequestBodySchemaType = z.infer<typeof RequestBodySchema>;