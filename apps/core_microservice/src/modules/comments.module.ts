import { Module } from '@nestjs/common';
import { CommentsService } from '../services/comments.service';
import { PrismaService } from '../services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CommentsController } from '../controllers/comments.controller';

@Module({
  imports: [],
  controllers: [CommentsController],
  providers: [CommentsService, PrismaService, ConfigService],
})
export class CommentsModule {}
