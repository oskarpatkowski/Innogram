import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { fileFilter, multerConfig } from '../configs/mutler.config';
import { AssetsController } from '../controllers/assets.controller';
import { AssetsService } from '../services/assetes.service';
import { AuthService } from '../services/auth.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  imports: [
    MulterModule.register({
      storage: multerConfig.storage,
      fileFilter: fileFilter,
    }),
  ],
  controllers: [AssetsController],
  providers: [AssetsService, PrismaService, ConfigService, AuthService],
})
export class AssetsModule {}
