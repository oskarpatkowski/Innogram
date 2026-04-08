import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { ChatsService } from '../services/chats.service';

@Module({
  imports: [PrismaService],
  controllers: [],
  providers: [ChatsService],
})
export class ChatsModule {}
