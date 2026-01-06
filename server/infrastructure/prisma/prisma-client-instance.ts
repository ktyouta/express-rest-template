import { PrismaClient } from "@prisma/client";

export class PrismaClientInstance {

    private static instance: PrismaClient = new PrismaClient();

    private constructor() {

    }

    public static getInstance(): PrismaClient {
        return this.instance;
    }
}