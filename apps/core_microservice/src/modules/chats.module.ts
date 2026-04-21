import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatsController } from '../controllers/chats.controller';
import { MessageControler } from '../controllers/message.controller';
import { AuthService } from '../services/auth.service';
import { ChatsService } from '../services/chats.service';
import { MessageService } from '../services/message.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  imports: [],
  controllers: [ChatsController, MessageControler],
  providers: [
    ChatsService,
    MessageService,
    PrismaService,
    ConfigService,
    AuthService,
  ],
})
export class ChatsModule {}
