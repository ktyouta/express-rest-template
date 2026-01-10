import { z } from "zod";

export const PathParamSchema = z.object({
    userId: z
        .string()
        .regex(/^\d+$/, "ユーザーIDが不正です。(数値以外)")
        .transform((val) => Number(val))
        .refine((val) => val > 0, "ユーザーIDが不正です。(負の値)"),
});

export type PathParamType = z.infer<typeof PathParamSchema>;