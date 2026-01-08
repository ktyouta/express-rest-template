import { z } from "zod";

// ユーザー情報登録時のリクエストのバリデーションチェック用
export const CreateFrontUserRequestSchema = z.object({
    userName: z.string().min(3, "ユーザー名は3文字以上で入力してください。").max(30, "ユーザー名は30文字以内で入力してください。"),
    userBirthday: z.string().regex(/^[0-9]{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/, "生年月日は日付形式(yyyyMMdd)である必要があります"),
    password: z.string().min(3, "パスワードは3文字以上で入力してください。").max(30, "パスワードは30文字以内で入力してください。"),
    confirmPassword: z.string().min(3, "確認用パスワードは3文字以上で入力してください。").max(30, "確認用パスワードは30文字以内で入力してください。"),
}).refine(data => data.password === data.confirmPassword, {
    message: '確認用パスワードが一致しません。',
    path: ['confirmPassword'],
});

export type CreateFrontUserRequestType = z.infer<typeof CreateFrontUserRequestSchema>;