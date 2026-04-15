import { Module } from '@nestjs/common';
import { CommentsService } from '../services/comments.service';
import { PrismaService } from '../services/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [],
  providers: [CommentsService, PrismaService, ConfigService],
})
export class CommentsModule {}
