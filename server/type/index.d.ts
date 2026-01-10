import { FrontUserId } from '../domain/frontuserid/front-user-id';
import { FrontUserInfoType } from './front-user.type';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: FrontUserId,
                info: FrontUserInfoType
            }
        }
    }
}

export { };

