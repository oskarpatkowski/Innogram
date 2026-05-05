import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateCommentDto } from '../../dto/create.comment.dto';
import { UpdateCommentDto } from '../../dto/update.comment.dto';
import type { AuthenticatedRequest } from '../guards/access.guard';
import { AccessGuard } from '../guards/access.guard';
import { CommentsService } from '../services/comments.service';

@Controller('comments')
@UseGuards(AccessGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Body() commentDto: CreateCommentDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return await this.commentsService.create(
      commentDto,
      request.user.profileId,
    );
  }

  @Get()
  async findAll() {
    return await this.commentsService.getAll();
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return await this.commentsService.getById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() commentDto: UpdateCommentDto) {
    return await this.commentsService.update(id, commentDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.commentsService.delete(id);
  }

  @Post(':id/like')
  async like(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return await this.commentsService.like(id, request.user.profileId);
  }

  @Delete(':id/like')
  async unlike(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return await this.commentsService.unlike(id, request.user.profileId);
  }
}
