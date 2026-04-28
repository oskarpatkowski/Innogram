import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from '../../dto/create.post.dto';
import { UpdatePostDto } from '../../dto/update.post.dto';
import type { AuthenticatedRequest } from '../guards/access.guard';
import { AccessGuard } from '../guards/access.guard';
import { PostsService } from '../services/posts.service';

@Controller('posts')
@UseGuards(AccessGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(
    @Body() postDto: CreatePostDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.userId;
    const profileId = request.user.profileId;

    return await this.postsService.create(postDto, userId, profileId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.postsService.getById(id);
  }

  @Get('/my')
  async getCurrentUserPosts(@Req() request: AuthenticatedRequest) {
    return await this.postsService.getProfilePosts(request.user.profileId);
  }

  @Get('/profile/:profileId')
  async getPostsByProfile(@Param('profileId') profileId: string) {
    return await this.postsService.getProfilePosts(profileId);
  }

  @Get()
  async getAll() {
    return await this.postsService.getAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() postDto: UpdatePostDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const post = await this.postsService.getById(id);

    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }

    if (request.user.profileId != post.profileId) {
      throw new Error('Unauthorized');
    }

    return await this.postsService.update(id, postDto);
  }

  @Patch(':id')
  async patch(@Param('id') id: string) {
    return await this.postsService.setPostAsArchived(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    const post = await this.postsService.getById(id);

    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }

    if (request.user.profileId != post.profileId) {
      throw new Error('Unauthorized');
    }

    return await this.postsService.delete(id);
  }
}
