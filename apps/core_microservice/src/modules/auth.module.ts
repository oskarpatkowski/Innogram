import { Module } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { PrismaService } from '../services/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [],
  providers: [AuthService, PrismaService, ConfigService],
})
export class AuthModule {}
