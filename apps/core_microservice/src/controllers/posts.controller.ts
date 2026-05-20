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
import { ApiQuery } from '@nestjs/swagger';
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

  @ApiQuery({
    name: 'lastCursor',
    required: false,
    type: String,
  })
  @Get('/my')
  async getCurrentUserPosts(
    @Req() request: AuthenticatedRequest,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('lastCursor') lastCursor?: string,
  ) {
    return await this.postsService.getProfilePosts(
      request.user.profileId,
      take,
      lastCursor,
    );
  }

  @ApiQuery({
    name: 'lastCursor',
    required: false,
    type: String,
  })
  @Get('/my/mentions')
  async getMyMentions(
    @Req() request: AuthenticatedRequest,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('lastCursor') lastCursor?: string,
  ) {
    return await this.postsService.getMentionedPosts(
      request.user.profileId,
      take,
      lastCursor,
    );
  }

  @ApiQuery({
    name: 'lastCursor',
    required: false,
    type: String,
  })
  @Get('/:id/mentions')
  async getMentions(
    @Param('id') id: string,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('lastCursor') lastCursor?: string,
  ) {
    return await this.postsService.getMentionedPosts(id, take, lastCursor);
  }

  @ApiQuery({
    name: 'lastCursor',
    required: false,
    type: String,
  })
  @Get('/profile/:profileId')
  async getPostsByProfile(
    @Param('profileId') profileId: string,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('lastCursor') lastCursor?: string,
  ) {
    return await this.postsService.getProfilePosts(profileId, take, lastCursor);
  }

  @ApiQuery({
    name: 'lastCursor',
    required: false,
    type: String,
  })
  @Get('/feed')
  async getFeed(
    @Req() request: AuthenticatedRequest,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('lastCursor') lastCursor?: string,
    @Query('ascOrDesc') ascOrDesc?: 'asc' | 'desc',
    @Query('by') by?: 'createdAt' | 'likes',
    @Query('timeframe') timeframe?: 'day' | 'week' | 'month' | 'year' | 'all',
  ) {
    return await this.postsService.getFeed(
      request.user.profileId,
      take,
      lastCursor,
      ascOrDesc,
      by,
      timeframe,
    );
  }

  @ApiQuery({
    name: 'lastCursor',
    required: false,
    type: String,
  })
  @Get('/search/:query')
  async getSearchResults(
    @Param('query') query: string,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('lastCursor') lastCursor?: string,
  ) {
    return await this.postsService.search(query, take, lastCursor);
  }

  @ApiQuery({
    name: 'lastCursor',
    required: false,
    type: String,
  })
  @Get('/popular')
  async getPopular(
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('lastCursor') lastCursor?: string,
    @Query('timeframe') timeframe?: 'day' | 'week' | 'month' | 'year' | 'all',
  ) {
    return await this.postsService.getPopular(take, lastCursor, timeframe);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.postsService.getById(id);
  }

  @Get(':id/likes')
  async getLikes(@Param('id') id: string) {
    return await this.postsService.getLikes(id);
  }

  @ApiQuery({
    name: 'lastCursor',
    required: false,
    type: String,
  })
  @Get()
  async getAll(
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
    @Query('lastCursor') lastCursor?: string,
  ) {
    return await this.postsService.getAll(take, lastCursor);
  }

  @Patch('archive/:id')
  async patch(@Param('id') id: string) {
    return await this.postsService.setPostAsArchived(id);
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

    return await this.postsService.update(id, postDto, request.user.userId);
  }

  @Post(':id/like')
  async like(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return await this.postsService.like(id, request.user.profileId);
  }

  @Delete(':id/like')
  async unlike(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return await this.postsService.unlike(id, request.user.profileId);
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
