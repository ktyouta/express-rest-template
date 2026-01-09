
export const API_ENDPOINT = {
    HEALTH: "/api/v1/health",
    REFRESH: "/api/v1/refresh",
    FRONT_USER: "/api/v1/frontuser",
    FRONT_USER_ID: "/api/v1/frontuser/:id",
} as const;

export type ApiEndopointType = typeof API_ENDPOINT[keyof typeof API_ENDPOINT];