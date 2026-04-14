import { PrismaClient } from '@prisma/client';
import config from '../config/config.ts';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: config.databaseUrl,
});

export const prismaClient = new PrismaClient({ adapter });

prismaClient.$connect().then(() => {
  console.log('Connected to Prisma Database');
}).catch((err) => {
  console.error('Prisma Client Connection Error', err);
});

process.on('SIGTERM', async () => {
  await prismaClient.$disconnect();
});
