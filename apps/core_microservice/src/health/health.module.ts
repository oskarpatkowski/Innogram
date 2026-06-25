import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PrismaService } from '../services/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [HealthController],
  providers: [PrismaService, ConfigService],
})
export class HealthModule {}
