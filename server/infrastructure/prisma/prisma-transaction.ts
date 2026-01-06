import { Prisma } from "@prisma/client";
import { NextFunction } from "express";
import { PrismaClientInstance } from "./prisma-client-instance";

export class PrismaTransaction {

    static start(fn: Function, next: NextFunction) {
        return PrismaClientInstance.getInstance().$transaction(async (tx: Prisma.TransactionClient) => {

            try {
                await fn(tx);
            } catch (err) {
                next(err);
            }
        });
    }
}