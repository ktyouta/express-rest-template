// httpStatusCodes.ts

export const HTTP_STATUS = {
    // --- Informational Responses (1xx) ---
    // 継続（クライアントがリクエストの一部を送信した後にサーバーが送る）
    CONTINUE: 100,
    // プロトコルの切り替え
    SWITCHING_PROTOCOLS: 101,

    // --- Successful Responses (2xx) ---
    // リクエスト成功
    OK: 200,
    // リソース作成成功
    CREATED: 201,
    // リクエスト受理（処理は非同期で進行中）
    ACCEPTED: 202,
    // コンテンツなし（リクエスト成功だが返すデータがない）
    NO_CONTENT: 204,

    // --- Redirection Messages (3xx) ---
    // 永久的リダイレクト
    MOVED_PERMANENTLY: 301,
    // 一時的リダイレクト
    FOUND: 302,
    // 他のリソースを参照
    SEE_OTHER: 303,
    // 内容未変更
    NOT_MODIFIED: 304,

    // --- Client Error Responses (4xx) ---
    // 不正なリクエスト
    BAD_REQUEST: 400,
    // 認証が必要
    UNAUTHORIZED: 401,
    // 権限がない
    FORBIDDEN: 403,
    // リソースが見つからない
    NOT_FOUND: 404,
    // 許可されていないメソッド
    METHOD_NOT_ALLOWED: 405,
    // 競合（リソース状態の矛盾）
    CONFLICT: 409,
    // 処理できないエンティティ（バリデーションエラー、業務的なルール違反など）
    UNPROCESSABLE_ENTITY: 422,

    // --- Server Error Responses (5xx) ---
    // サーバー内部エラー
    INTERNAL_SERVER_ERROR: 500,
    // 未実装（機能未対応）
    NOT_IMPLEMENTED: 501,
    // 不正なゲートウェイ応答
    BAD_GATEWAY: 502,
    // サービス利用不可
    SERVICE_UNAVAILABLE: 503,
    // ゲートウェイタイムアウト
    GATEWAY_TIMEOUT: 504,
} as const satisfies Record<string, number>;
