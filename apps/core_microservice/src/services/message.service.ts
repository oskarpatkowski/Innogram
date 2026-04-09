import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateChatMessageDto } from '../../dto/create.message.dto';
import { UpdateChatMessageDto } from '../../dto/update.message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateChatMessageDto) {
    return await this.prisma.message.create({
      data: dto,
    });
  }

  async getById(id: string) {
    return await this.prisma.message.findUnique({
      where: {
        id,
      },
    });
  }

  async getAll() {
    return await this.prisma.message.findMany();
  }

  async update(id: string, messageDto: UpdateChatMessageDto) {
    return await this.prisma.message.update({
      where: {
        id,
      },
      data: messageDto,
    });
  }

  async delete(id: string) {
    return await this.prisma.message.delete({
      where: {
        id,
      },
    });
  }
}
