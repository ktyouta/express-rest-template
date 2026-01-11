import { Prisma } from "@prisma/client";
import { NextFunction } from "express";
import { PrismaClientInstance } from "./prisma-client-instance";

export class PrismaTransaction {

    static start<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>, next: NextFunction): Promise<T> {
        return PrismaClientInstance.getInstance().$transaction(async (tx: Prisma.TransactionClient) => {

            try {
                return await fn(tx);
            } catch (err) {
                next(err);
                throw err;
            }
        });
    }
}