import { PrismaClient } from '@innogram/database';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configservice: ConfigService) {
    const connectionString = configservice.get<string>('DATABASE_URL');
    if (!connectionString) {
      throw new Error(
        'DATABASE_URL is not defined in the environment variables',
      );
    }
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    Logger.log('PrismaService connected to db', 'Database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
