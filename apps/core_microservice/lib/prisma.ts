import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prism/client';

const dbUser = process.env.POSTGRES_NAME || 'postgres';
const dbPass = process.env.POSTGRES_PASSWD || 'password';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '5432';

const databaseUrl =
  process.env.DATABASE_URL ||
  `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbUser}`;

const connectionString = databaseUrl;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in the environment variables');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };
