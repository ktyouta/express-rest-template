import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
    try {
        const result = await prisma.$queryRaw`SELECT 1`;

        console.log('Connection test successful:', result);
    } catch (error) {
        console.error('Connection test failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();