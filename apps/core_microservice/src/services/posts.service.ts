import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { CreatePostDto } from '../../dto/create.post.dto';
import { UpdatePostDto } from '../../dto/update.post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePostDto) {
    return await this.prisma.post.create({
      data: dto,
    });
  }

  async getById(id: string) {
    return await this.prisma.post.findUnique({
      where: {
        id,
      },
    });
  }

  async getAll() {
    return await this.prisma.post.findMany();
  }

  async update(id: string, postDto: UpdatePostDto) {
    return await this.prisma.post.update({
      where: {
        id,
      },
      data: postDto,
    });
  }

  async delete(id: string) {
    return await this.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}
