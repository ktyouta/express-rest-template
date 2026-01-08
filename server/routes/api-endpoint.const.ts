
export const ApiEndopoint = {
    HEALTH: "/path/v1/health",
    REFRESH: "/path/v1/refresh",
    FRONT_USER: "/path/v1/front-user",
} as const;

export type ApiEndopointType = typeof ApiEndopoint[keyof typeof ApiEndopoint];