import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../../dto/create.comment.dto';
import { AccessGuard } from '../guards/access.guard';

@Controller('comments')
@UseGuards(AccessGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Body() commentDto: CreateCommentDto) {
    return await this.commentsService.create(commentDto);
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
  async update(@Param('id') id: string, @Body() commentDto: CreateCommentDto) {
    return await this.commentsService.update(id, commentDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.commentsService.delete(id);
  }
}
