import { Module } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { PrismaService } from '../services/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [],
  providers: [PostsService, PrismaService, ConfigService],
})
export class PostsModule {}
