import { Injectable, Logger, Req } from '@nestjs/common';
import { CreatePostDto } from '../../dto/create.post.dto';
import { UpdatePostDto } from '../../dto/update.post.dto';
import type { AuthenticatedRequest } from '../guards/access.guard';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePostDto, userId: string, profileId: string) {
    const post = await this.prisma.post.create({
      data: {
        ...dto,
        createdById: userId,
        profileId: profileId,
      },
    });
    Logger.log(`Post ${post.id} created`, 'PostsService');

    if (dto.assetIds) {
      for (const assetId of dto.assetIds) {
        await this.linkAssetToPost(assetId, post.id, userId);
        Logger.log(
          `Linked asset ${assetId} to post ${post.id} by user ${userId}`,
          'PostsService',
        );
      }
    }

    return post;
  }

  async getById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (post) {
      Logger.log(`Post ${post.id} found`, 'PostsService');
    } else {
      Logger.log(`Post ${id} not found`, 'PostsService');
    }

    return post;
  }

  async getProfilePosts(profileId: string) {
    const posts = await this.prisma.post.findMany({
      where: {
        profileId: profileId,
      },
    });

    Logger.log(
      `Found ${posts.length} posts for profile ${profileId}`,
      'PostsService',
    );

    return posts;
  }

  async setPostAsArchived(id: string) {
    const post = await this.prisma.post.update({
      where: {
        id,
      },
      data: {
        isArchived: true,
      },
    });

    Logger.log(`Post ${post.id} archived`, 'PostsService');

    return post;
  }

  async getAll() {
    const posts = await this.prisma.post.findMany();

    if (posts.length > 0) {
      Logger.log(`Found ${posts.length} posts`, 'PostsService');
    } else {
      Logger.log(`No posts found`, 'PostsService');
    }

    return posts;
  }

  async update(id: string, postDto: UpdatePostDto) {
    const post = await this.prisma.post.update({
      where: {
        id,
      },
      data: postDto,
    });

    Logger.log(`Post ${post.id} updated`, 'PostsService');

    return post;
  }

  async delete(id: string) {
    const post = await this.prisma.post.delete({
      where: {
        id,
      },
    });

    if (post) {
      Logger.log(`Post ${post.id} deleted`, 'PostsService');
    } else {
      Logger.log(`Post ${id} not found`, 'PostsService');
    }

    return post;
  }

  async linkAssetToPost(assetId: string, postId: string, userId: string) {
    Logger.log(
      `Linking asset ${assetId} to post ${postId} by user ${userId}`,
      'AssetsService',
    );

    const linked = await this.prisma.postAsset.create({
      data: {
        assetId: assetId,
        postId: postId,
        createdById: userId,
      },
    });

    return linked;
  }

  async getFeed(@Req() request: AuthenticatedRequest) {
    const follows = await this.prisma.profileFollow.findMany({
      where: {
        followerProfileId: request.user.profileId,
      },
      select: {
        followingProfileId: true,
      },
    });
    const followingProfileIds = follows.map(
      (follow) => follow.followingProfileId,
    );

    const posts = await this.prisma.post.findMany({
      where: {
        profileId: {
          in: followingProfileIds,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts;
  }
}
