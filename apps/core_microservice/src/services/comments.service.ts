import { Injectable, Logger } from '@nestjs/common';
import { CreateCommentDto } from '../../dto/create.comment.dto';
import { UpdateCommentDto } from '../../dto/update.comment.dto';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCommentDto) {
    const comment = await this.prisma.comment.create({
      data: dto,
    });
    Logger.log(`Comment ${comment.id} created`, 'CommentsService');
    return comment;
  }

  async getById(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (comment) {
      Logger.log(`Comment ${comment.id} found`, 'CommentsService');
    } else {
      Logger.log(`Comment ${id} not found`, 'CommentsService');
    }

    return comment;
  }

  async getAll() {
    const comments = await this.prisma.comment.findMany();

    if (comments.length > 0) {
      Logger.log(`Found ${comments.length} comments`, 'CommentsService');
    } else {
      Logger.log(`No comments found`, 'CommentsService');
    }

    return comments;
  }

  async update(id: string, commentDto: UpdateCommentDto) {
    const comment = await this.prisma.comment.update({
      where: {
        id,
      },
      data: commentDto,
    });

    Logger.log(`Comment ${comment.id} updated`, 'CommentsService');

    return comment;
  }

  async delete(id: string) {
    const comment = await this.prisma.comment.delete({
      where: {
        id,
      },
    });

    if (comment) {
      Logger.log(`Comment ${comment.id} deleted`, 'CommentsService');
    } else {
      Logger.log(`Comment ${id} not found`, 'CommentsService');
    }

    return comment;
  }
}
