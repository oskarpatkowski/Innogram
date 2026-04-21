import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostsController } from '../controllers/posts.controller';
import { AuthService } from '../services/auth.service';
import { PostsService } from '../services/posts.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [PostsService, PrismaService, ConfigService, AuthService],
})
export class PostsModule {}
