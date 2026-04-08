import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { CommentsService } from '../services/comments.service';

@Module({
  imports: [PrismaService],
  controllers: [],
  providers: [CommentsService],
})
export class CommentsModule {}
