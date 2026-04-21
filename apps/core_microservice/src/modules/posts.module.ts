import { Module } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { PrismaService } from '../services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PostsController } from '../controllers/posts.controller';

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [PostsService, PrismaService, ConfigService],
})
export class PostsModule {}
