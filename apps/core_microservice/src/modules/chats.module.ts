import { Module } from '@nestjs/common';
import { ChatsService } from '../services/chats.service';
import { PrismaService } from '../services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ChatsController } from '../controllers/chats.controller';
import { MessageService } from '../services/message.service';

@Module({
  imports: [],
  controllers: [ChatsController],
  providers: [ChatsService, MessageService, PrismaService, ConfigService],
})
export class ChatsModule {}
