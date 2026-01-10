import { Request } from 'express';
import { FrontUserId } from '../domain/frontuserid/front-user-id';
import { FrontUserInfoType } from './front-user.type';

export type AuthenticatedRequestType = {
    user: {
        userId: FrontUserId,
        info: FrontUserInfoType,
    }
} & Request;