import { Module } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { PrismaService } from '../services/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [],
  providers: [UsersService, PrismaService, ConfigService],
})
export class UsersModule {}
