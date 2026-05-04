import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommentsController } from '../controllers/comments.controller';
import { AuthService } from '../services/auth.service';
import { CommentsService } from '../services/comments.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  imports: [],
  controllers: [CommentsController],
  providers: [CommentsService, PrismaService, ConfigService, AuthService],
})
export class CommentsModule {}
