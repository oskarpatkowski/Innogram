import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { CreatePostDto } from '../../dto/create.post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() postDto: CreatePostDto) {
    return await this.postsService.create(postDto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.postsService.getById(id);
  }

  @Get()
  async getAll() {
    return await this.postsService.getAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() postDto: CreatePostDto) {
    return await this.postsService.update(id, postDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.postsService.delete(id);
  }
}
