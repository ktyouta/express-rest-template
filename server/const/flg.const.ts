export const FLG = {
    OFF: "0",
    ON: "1"
} as const;

export type dbFlg = typeof FLG[keyof typeof FLG];