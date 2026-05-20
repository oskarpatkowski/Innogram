import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from '../../dto/create.post.dto';
import { UpdatePostDto } from '../../dto/update.post.dto';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePostDto, userId: string, profileId: string) {
    const post = await this.prisma.post.create({
      data: {
        content: dto.content,
        createdById: userId,
        profileId: profileId,
      },
    });
    Logger.log(`Post ${post.id} created`, 'PostsService');

    this.handleMentions(dto.content, post.id, profileId, userId).catch(
      (err) => {
        Logger.error(
          `Failed to handle mentions for post ${post.id}`,
          err instanceof Error ? err.message : String(err),
          'PostsService',
        );
      },
    );

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

  private async handleMentions(
    content: string,
    postId: string,
    authorProfileId: string,
    authorUserId: string,
  ) {
    const mentionRegex = /@([a-zA-Z0-9_.-]+)/g;
    const matches = [...content.matchAll(mentionRegex)];
    const usernames = matches.map((match) => match[1]);

    if (usernames.length === 0) return;

    const uniqueUsernames = [...new Set(usernames)];

    const mentionedProfiles = await this.prisma.profile.findMany({
      where: {
        username: { in: uniqueUsernames },
        id: { not: authorProfileId },
      },
    });

    for (const profile of mentionedProfiles) {
      await this.prisma.notification.create({
        data: {
          type: 'MENTION',
          title: 'New Mention',
          message: `You were mentioned in a post.`,
          data: JSON.stringify({ postId, authorProfileId }),
          createdById: authorUserId,
          recipientId: profile.id,
        },
      });

      await this.prisma.postMention.create({
        data: {
          postId: postId,
          profileId: profile.id,
          createdById: authorUserId,
        },
      });
    }

    Logger.log(
      `Handled ${mentionedProfiles.length} mentions for post ${postId}`,
      'PostsService',
    );
  }

  async getMentionedPosts(
    profileId: string,
    take: number,
    lastCursor?: string,
  ) {
    const result = await this.prisma.post.findMany({
      take: take + 1,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      where: {
        postMentions: {
          some: {
            profileId: profileId,
          },
        },
      },
      include: {
        postAssets: {
          include: {
            asset: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (result.length == 0) {
      return {
        data: [],
        metaData: {
          hasNextPage: false,
          lastCursor: null,
        },
      };
    }

    const hasNextPage = result.length > take;
    if (hasNextPage) {
      result.pop();
    }

    const lastPostInResults = result[result.length - 1];
    const cursor = lastPostInResults.id;

    Logger.log(
      `Found ${result.length} mentioned posts for profile ${profileId}`,
      'PostsService',
    );

    return {
      data: result,
      metaData: {
        hasNextPage,
        lastCursor: cursor,
      },
    };
  }

  async getById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        postAssets: {
          include: {
            asset: true,
          },
        },
      },
    });

    if (post) {
      Logger.log(`Post ${post.id} found`, 'PostsService');
    } else {
      Logger.log(`Post ${id} not found`, 'PostsService');
    }

    return post;
  }

  async getProfilePosts(profileId: string, take: number, lastCursor?: string) {
    const result = await this.prisma.post.findMany({
      take: take + 1,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      where: {
        profileId: profileId,
      },
      include: {
        postAssets: {
          include: {
            asset: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (result.length == 0) {
      return {
        data: [],
        metaData: {
          hasNextPage: false,
          lastCursor: null,
        },
      };
    }

    const hasNextPage = result.length > take;
    if (hasNextPage) {
      result.pop();
    }

    const lastPostInResults = result[result.length - 1];
    const cursor = lastPostInResults.id;

    const data = {
      data: result,
      metaData: {
        hasNextPage,
        lastCursor: cursor,
      },
    };

    Logger.log(`fetching posts for profile ${profileId}`, 'PostsService');

    return data;
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

  async getAll(take: number, lastCursor?: string) {
    const result = await this.prisma.post.findMany({
      take: take + 1,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (result.length == 0) {
      return {
        data: [],
        metaData: {
          hasNextPage: false,
          lastCursor: null,
        },
      };
    }

    const hasNextPage = result.length > take;
    if (hasNextPage) {
      result.pop();
    }

    const lastPostInResults = result[result.length - 1];
    const cursor = lastPostInResults.id;

    Logger.log(`Found ${result.length} posts`, 'PostsService');

    return {
      data: result,
      metaData: {
        hasNextPage,
        lastCursor: cursor,
      },
    };
  }

  async update(id: string, postDto: UpdatePostDto, userId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const post = await prisma.post.update({
        where: { id },
        data: { content: postDto.content },
      });

      const existingAssets = await prisma.postAsset.findMany({
        where: { postId: id },
      });
      const existingAssetIds = existingAssets.map((asset) => asset.assetId);
      const newAssetIds = postDto.assetIds || [];

      const assetsToDelete = existingAssetIds.filter(
        (assetId) => !newAssetIds.includes(assetId),
      );
      const assetsToAdd = newAssetIds.filter(
        (assetId) => !existingAssetIds.includes(assetId),
      );

      if (assetsToDelete.length > 0) {
        await prisma.postAsset.deleteMany({
          where: {
            postId: id,
            assetId: { in: assetsToDelete },
          },
        });
      }

      if (assetsToAdd.length > 0) {
        await prisma.postAsset.createMany({
          data: assetsToAdd.map((assetId) => ({
            postId: id,
            assetId: assetId,
            createdById: userId,
          })),
        });
      }

      Logger.log(`Post ${post.id} updated`, 'PostsService');
      return post;
    });
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

  async getFeed(profileId: string, take: number, lastCursor?: string) {
    const follows = await this.prisma.profileFollow.findMany({
      where: {
        followerProfileId: profileId,
      },
      select: {
        followingProfileId: true,
      },
    });
    const followingProfileIds = follows.map(
      (follow) => follow.followingProfileId,
    );

    const result = await this.prisma.post.findMany({
      take: take + 1,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      where: {
        profileId: {
          in: followingProfileIds,
        },
      },
      include: {
        postAssets: {
          include: {
            asset: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (result.length == 0) {
      return {
        data: [],
        metaData: {
          hasNextPage: false,
          lastCursor: null,
        },
      };
    }

    const hasNextPage = result.length > take;
    if (hasNextPage) {
      result.pop();
    }

    const lastPostInResults = result[result.length - 1];
    const cursor = lastPostInResults.id;

    Logger.log(
      `Found ${result.length} feed posts for profile ${profileId}`,
      'PostsService',
    );

    return {
      data: result,
      metaData: {
        hasNextPage,
        lastCursor: cursor,
      },
    };
  }

  async search(query: string, take: number, lastCursor?: string) {
    const result = await this.prisma.post.findMany({
      take: take + 1,
      ...(lastCursor && {
        skip: 1,
        cursor: {
          id: lastCursor,
        },
      }),
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        content: {
          contains: query,
        },
      },
      include: {
        postAssets: {
          include: {
            asset: true,
          },
        },
      },
    });

    if (result.length == 0) {
      return {
        data: [],
        metaData: {
          hasNextPage: false,
          lastCursor: null,
        },
      };
    }

    const hasNextPage = result.length > take;
    if (hasNextPage) {
      result.pop();
    }

    const lastPostInResults = result[result.length - 1];
    const cursor = lastPostInResults.id;

    Logger.log(
      `Found ${result.length} search results for query ${query}`,
      'PostsService',
    );

    return {
      data: result,
      metaData: {
        hasNextPage,
        lastCursor: cursor,
      },
    };
  }

  async like(postId: string, profileId: string) {
    const user = await this.prisma.profile.findFirst({
      where: {
        id: profileId,
      },
    });

    if (!user) {
      throw new Error(`User for profile ${profileId} not found`);
    }

    const like = await this.prisma.postLike.create({
      data: {
        postId: postId,
        profileId: profileId,
        createdById: user.userId,
        updatedById: user.userId,
      },
    });

    Logger.log(`Post ${postId} liked by user ${profileId}`, 'PostsService');

    return like;
  }

  async unlike(postId: string, profileId: string) {
    const like = await this.prisma.postLike.delete({
      where: {
        postId_profileId: {
          postId: postId,
          profileId: profileId,
        },
      },
    });

    Logger.log(`Post ${postId} unliked by user ${profileId}`, 'PostsService');

    return like;
  }

  async getLikes(postId: string) {
    const likes = await this.prisma.postLike.findMany({
      where: {
        postId: postId,
      },
    });

    Logger.log(
      `Found ${likes.length} likes for post ${postId}`,
      'PostsService',
    );

    return likes;
  }
}
