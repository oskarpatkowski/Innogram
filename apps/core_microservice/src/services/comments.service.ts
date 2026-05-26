import { Injectable, Logger } from '@nestjs/common';
import { CreateCommentDto } from '../../dto/create.comment.dto';
import { UpdateCommentDto } from '../../dto/update.comment.dto';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCommentDto, profileId: string) {
    const user = await this.prisma.profile.findFirst({
      where: {
        id: profileId,
      },
    });

    if (!user) {
      throw new Error(`User for profile ${profileId} not found`);
    }

    const comment = await this.prisma.comment.create({
      data: {
        ...dto,
        profileId: profileId,
        createdById: user.userId,
        updatedById: user.userId,
      },
    });

    Logger.log(`Comment ${comment.id} created`, 'CommentsService');

    this.handleMentions(
      dto.content,
      comment.id,
      comment.postId,
      profileId,
      user.userId,
    ).catch((err) => {
      Logger.error(
        `Failed to handle mentions for comment ${comment.id}`,
        err instanceof Error ? err.message : String(err),
        'CommentsService',
      );
    });

    return comment;
  }

  private async handleMentions(
    content: string,
    commentId: string,
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
          title: 'New Mention in Comment',
          message: `You were mentioned in a comment.`,
          data: JSON.stringify({ postId, commentId, authorProfileId }),
          createdById: authorUserId,
          recipientId: profile.id,
        },
      });

      await this.prisma.commentMention.create({
        data: {
          commentId: commentId,
          profileId: profile.id,
          createdById: authorUserId,
        },
      });
    }

    Logger.log(
      `Handled ${mentionedProfiles.length} mentions for comment ${commentId}`,
      'CommentsService',
    );
  }

  async getById(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (comment) {
      Logger.log(`Comment ${comment.id} found`, 'CommentsService');
    } else {
      Logger.log(`Comment ${id} not found`, 'CommentsService');
    }

    return comment;
  }

  async getAll() {
    const comments = await this.prisma.comment.findMany();

    if (comments.length > 0) {
      Logger.log(`Found ${comments.length} comments`, 'CommentsService');
    } else {
      Logger.log(`No comments found`, 'CommentsService');
    }

    return comments;
  }

  async update(id: string, commentDto: UpdateCommentDto) {
    const comment = await this.prisma.comment.update({
      where: {
        id,
      },
      data: commentDto,
    });

    Logger.log(`Comment ${comment.id} updated`, 'CommentsService');

    this.handleMentions(
      commentDto?.content || '',
      comment.id,
      comment.postId,
      comment.profileId,
      comment.createdById,
    ).catch((err) => {
      Logger.error(
        `Failed to re-handle mentions for updated comment ${comment.id}`,
        err instanceof Error ? err.message : String(err),
        'CommentsService',
      );
    });

    return comment;
  }

  async delete(id: string) {
    const comment = await this.prisma.comment.delete({
      where: {
        id,
      },
    });

    if (comment) {
      Logger.log(`Comment ${comment.id} deleted`, 'CommentsService');
    } else {
      Logger.log(`Comment ${id} not found`, 'CommentsService');
    }

    return comment;
  }

  async like(commentId: string, profileId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        id: profileId,
      },
    });

    if (!profile) {
      throw new Error(`Profile ${profileId} not found`);
    }

    const commentLike = await this.prisma.commentLike.create({
      data: {
        commentId: commentId,
        profileId: profileId,
        createdById: profile.userId,
        updatedById: profile.userId,
      },
    });

    Logger.log(
      `Comment ${commentId} liked by profile ${profileId}`,
      'CommentsService',
    );

    return commentLike;
  }

  async unlike(commentId: string, profileId: string) {
    const like = await this.prisma.commentLike.delete({
      where: {
        commentId_profileId: {
          commentId: commentId,
          profileId: profileId,
        },
      },
    });

    Logger.log(
      `Comment ${commentId} unliked by profile ${profileId}`,
      'CommentsService',
    );

    return like;
  }

  async getForPost(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }

    const comments = await this.prisma.comment.findMany({
      where: {
        postId: postId,
      },
    });

    Logger.log(
      `Found ${comments.length} comments for post ${postId}`,
      'CommentsService',
    );

    return comments;
  }

  async getLikes(commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new Error(`Comment ${commentId} not found`);
    }

    const likes = await this.prisma.commentLike.findMany({
      where: {
        commentId: commentId,
      },
    });

    Logger.log(
      `Found ${likes.length} likes for comment ${commentId}`,
      'CommentsService',
    );

    return likes;
  }
}
