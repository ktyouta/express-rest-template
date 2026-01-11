import { Prisma } from "@prisma/client";
import { PrismaClientInstance } from "./prisma-client-instance";

export class PrismaTransaction {

    static start<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
        return PrismaClientInstance.getInstance().$transaction(async (tx: Prisma.TransactionClient) => {
            return await fn(tx);
        });
    }
}