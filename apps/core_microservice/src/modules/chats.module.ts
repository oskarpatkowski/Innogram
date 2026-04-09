import { Module } from '@nestjs/common';
import { ChatsService } from '../services/chats.service';
import { PrismaService } from '../services/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [],
  providers: [ChatsService, PrismaService, ConfigService],
})
export class ChatsModule {}
