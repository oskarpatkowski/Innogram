import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from '../../dto/create.post.dto';
import { UpdatePostDto } from '../../dto/update.post.dto';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: dto,
    });
    Logger.log(`Post ${post.id} created`, 'PostsService');
    return post;
  }

  async getById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (post) {
      Logger.log(`Post ${post.id} found`, 'PostsService');
    } else {
      Logger.log(`Post ${id} not found`, 'PostsService');
    }

    return post;
  }

  async getAll() {
    const posts = await this.prisma.post.findMany();

    if (posts.length > 0) {
      Logger.log(`Found ${posts.length} posts`, 'PostsService');
    } else {
      Logger.log(`No posts found`, 'PostsService');
    }

    return posts;
  }

  async update(id: string, postDto: UpdatePostDto) {
    const post = await this.prisma.post.update({
      where: {
        id,
      },
      data: postDto,
    });

    Logger.log(`Post ${post.id} updated`, 'PostsService');

    return post;
  }

  async delete(id: string) {
    const post = await this.prisma.post.delete({
      where: {
        id,
      },
    });

    if (post) {
      Logger.log(`Post ${post.id} deleted`, 'PostsService');
    } else {
      Logger.log(`Post ${id} not found`, 'PostsService');
    }

    return post;
  }
}
