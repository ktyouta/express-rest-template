
declare global {
    namespace Express {
        interface Request {
            userInfo?: {
                frontUserIdModel: FrontUserIdModel,
                frontUserInfo: FrontUserInfoType
            }
        }
    }
}

export { };

