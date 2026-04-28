import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
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

  @Get('/my')
  async getCurrentUserPosts(
    @Req() request: AuthenticatedRequest,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('lastCursor') lastCursor: string,
  ) {
    return await this.postsService.getProfilePosts(
      request.user.profileId,
      take,
      lastCursor,
    );
  }

  @Get('/profile/:profileId')
  async getPostsByProfile(
    @Param('profileId') profileId: string,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('lastCursor') lastCursor: string,
  ) {
    return await this.postsService.getProfilePosts(profileId, take, lastCursor);
  }

  @Get('/feed')
  async getFeed(
    @Req() request: AuthenticatedRequest,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('lastCursor') lastCursor: string,
  ) {
    return await this.postsService.getFeed(
      request.user.profileId,
      take,
      lastCursor,
    );
  }

  @Get('/search/:query')
  async getSearchResults(
    @Param('query') query: string,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('lastCursor') lastCursor: string,
  ) {
    return await this.postsService.search(query, take, lastCursor);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.postsService.getById(id);
  }

  @Get()
  async getAll(
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('lastCursor') lastCursor: string,
  ) {
    return await this.postsService.getAll(take, lastCursor);
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
