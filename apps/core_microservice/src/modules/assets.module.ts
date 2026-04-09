import { Module } from '@nestjs/common';
import { AssetsService } from '../services/assetes.service';
import { AssetsController } from '../controllers/assets.controller';
import { PrismaService } from '../services/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AssetsController],
  providers: [AssetsService, PrismaService, ConfigService],
})
export class AssetsModule {}
