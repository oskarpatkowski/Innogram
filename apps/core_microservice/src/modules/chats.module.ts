import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatsController } from '../controllers/chats.controller';
import { MessageController } from '../controllers/message.controller';
import { AuthService } from '../services/auth.service';
import { ChatGateway } from '../services/chat.gateway';
import { ChatsService } from '../services/chats.service';
import { MessageService } from '../services/message.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  imports: [],
  controllers: [ChatsController, MessageController],
  providers: [
    ChatGateway,
    ChatsService,
    MessageService,
    PrismaService,
    ConfigService,
    AuthService,
  ],
})
export class ChatsModule {}
