
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: FrontUserIdModel,
                info: FrontUserInfoType
            }
        }
    }
}

export { };

