import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { CreateCommentDto } from '../../dto/create.comment.dto';
import { UpdateCommentDto } from '../../dto/update.comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCommentDto) {
    return await this.prisma.comment.create({
      data: dto,
    });
  }

  async getById(id: string) {
    return await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });
  }

  async getAll() {
    return await this.prisma.comment.findMany();
  }

  async update(id: string, commentDto: UpdateCommentDto) {
    return await this.prisma.comment.update({
      where: {
        id,
      },
      data: commentDto,
    });
  }

  async delete(id: string) {
    return await this.prisma.comment.delete({
      where: {
        id,
      },
    });
  }
}
