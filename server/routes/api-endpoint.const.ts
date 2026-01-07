
export const ApiEndopoint = {
    HEALTH: "/path/v1/health",
    REFRESH: "/path/v1/refresh",
} as const;

export type ApiEndopointType = typeof ApiEndopoint[keyof typeof ApiEndopoint];