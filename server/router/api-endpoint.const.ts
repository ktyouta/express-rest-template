
export const API_ENDPOINT = {
    HEALTH: "/api/v1/health",
    REFRESH: "/api/v1/refresh",
    FRONT_USER: "/api/v1/frontuser",
    FRONT_USER_ID: "/api/v1/frontuser/:id",
    FRONT_USER_LOGIN: "/api/v1/frontuserlogin",
} as const;

export type ApiEndpointType = typeof API_ENDPOINT[keyof typeof API_ENDPOINT];