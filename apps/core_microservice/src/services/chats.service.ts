import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { CreateChatDto } from '../../dto/create.chat.dto';
import { UpdateChatDto } from '../../dto/update.chat.dto';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {}

  //TODO should probably add curent user to chat when creating
  //will do after auth
  async create(dto: CreateChatDto) {
    return await this.prisma.chat.create({
      data: dto,
    });
  }

  async getById(id: string) {
    return await this.prisma.chat.findUnique({
      where: {
        id,
      },
    });
  }

  async getAll() {
    return await this.prisma.chat.findMany();
  }

  async update(id: string, chatDto: UpdateChatDto) {
    return await this.prisma.chat.update({
      where: {
        id,
      },
      data: chatDto,
    });
  }

  async delete(id: string) {
    return await this.prisma.chat.delete({
      where: {
        id,
      },
    });
  }
}
