import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateChatMessageDto } from '../../dto/create.message.dto';
import { UpdateChatMessageDto } from '../../dto/update.message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateChatMessageDto) {
    const message = await this.prisma.message.create({
      data: dto,
    });
    Logger.log(`Message ${message.id} created`, 'MessageService');
    return message;
  }

  async getById(id: string) {
    const message = await this.prisma.message.findUnique({
      where: {
        id,
      },
    });

    if (message) {
      Logger.log(`Message ${message.id} found`, 'MessageService');
    } else {
      Logger.log(`Message ${id} not found`, 'MessageService');
    }

    return message;
  }

  async getAll() {
    const messages = await this.prisma.message.findMany();

    if (messages.length > 0) {
      Logger.log(`Found ${messages.length} messages`, 'MessageService');
    } else {
      Logger.log(`No messages found`, 'MessageService');
    }

    return messages;
  }

  async update(id: string, messageDto: UpdateChatMessageDto) {
    const message = await this.prisma.message.update({
      where: {
        id,
      },
      data: messageDto,
    });

    Logger.log(`Message ${message.id} updated`, 'MessageService');

    return message;
  }

  async delete(id: string) {
    const message = await this.prisma.message.delete({
      where: {
        id,
      },
    });

    if (message) {
      Logger.log(`Message ${message.id} deleted`, 'MessageService');
    } else {
      Logger.log(`Message ${id} not found`, 'MessageService');
    }

    return message;
  }
}
