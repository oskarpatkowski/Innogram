import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { PostsService } from '../services/posts.service';

@Module({
  imports: [PrismaService],
  controllers: [],
  providers: [PostsService],
})
export class PostsModule {}
