/**
 * httpメソッド
 */
export const HTTP_METHOD = {
    GET: `GET`,
    POST: `POST`,
    PUT: `PUT`,
    DELETE: `DELETE`,
} as const;

export type HttpMethodType = typeof HTTP_METHOD[keyof typeof HTTP_METHOD];