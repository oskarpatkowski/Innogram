import { Module } from '@nestjs/common';
import { ChatsService } from '../services/chats.service';
import { PrismaService } from '../services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ChatsController } from '../controllers/chats.controller';
import { MessageService } from '../services/message.service';
import { MessageControler } from '../controllers/message.controller';

@Module({
  imports: [],
  controllers: [ChatsController, MessageControler],
  providers: [ChatsService, MessageService, PrismaService, ConfigService],
})
export class ChatsModule {}
