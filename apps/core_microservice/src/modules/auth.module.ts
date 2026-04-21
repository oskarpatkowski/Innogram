import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { PrismaService } from '../services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AuthController } from '../controllers/auth.controller';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, ConfigService],
})
export class AuthModule {}
