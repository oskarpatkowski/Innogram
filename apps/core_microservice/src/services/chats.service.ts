import { Injectable, Logger } from '@nestjs/common';
import { CreateChatDto } from '../../dto/create.chat.dto';
import { UpdateChatDto } from '../../dto/update.chat.dto';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {}

  //TODO should probably add curent user to chat when creating
  //will do after auth
  async create(dto: CreateChatDto) {
    const chat = await this.prisma.chat.create({
      data: dto,
    });
    Logger.log(`Chat ${chat.id} created`, 'ChatsService');
    return chat;
  }

  async getById(id: string) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id,
      },
    });

    if (chat) {
      Logger.log(`Chat ${chat.id} found`, 'ChatsService');
    } else {
      Logger.log(`Chat ${id} not found`, 'ChatsService');
    }

    return chat;
  }

  async getAll() {
    const chats = await this.prisma.chat.findMany();

    if (chats.length > 0) {
      Logger.log(`Found ${chats.length} chats`, 'ChatsService');
    } else {
      Logger.log(`No chats found`, 'ChatsService');
    }

    return chats;
  }

  async update(id: string, chatDto: UpdateChatDto) {
    const chat = await this.prisma.chat.update({
      where: {
        id,
      },
      data: chatDto,
    });

    Logger.log(`Chat ${chat.id} updated`, 'ChatsService');

    return chat;
  }

  async delete(id: string) {
    const chat = await this.prisma.chat.delete({
      where: {
        id,
      },
    });

    if (chat) {
      Logger.log(`Chat ${chat.id} deleted`, 'ChatsService');
    } else {
      Logger.log(`Chat ${id} not found`, 'ChatsService');
    }

    return chat;
  }
}
