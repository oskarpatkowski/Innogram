import { Injectable, Logger } from '@nestjs/common';
import { CreateProfileDto } from '../../dto/create.profile.dto';
import { UpdateProfileDto } from '../../dto/update.profile.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProfileDto) {
    const profile = await this.prisma.profile.create({
      data: dto,
    });
    Logger.log(`Profile ${profile.id} created`, 'ProfileService');
    return profile;
  }

  async getById(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        id,
      },
    });

    if (profile) {
      Logger.log(`Profile ${profile.id} found`, 'ProfileService');
    } else {
      Logger.log(`Profile ${id} not found`, 'ProfileService');
    }

    return profile;
  }

  async getAll() {
    const profiles = await this.prisma.profile.findMany();

    if (profiles.length > 0) {
      Logger.log(`Found ${profiles.length} profiles`, 'ProfileService');
    } else {
      Logger.log(`No profiles found`, 'ProfileService');
    }

    return profiles;
  }

  async update(id: string, profileDto: UpdateProfileDto) {
    const profile = await this.prisma.profile.update({
      where: {
        id,
      },
      data: profileDto,
    });

    Logger.log(`Profile ${profile.id} updated`, 'ProfileService');

    return profile;
  }

  async delete(id: string) {
    const profile = await this.prisma.profile.delete({
      where: {
        id,
      },
    });

    if (profile) {
      Logger.log(`Profile ${profile.id} deleted`, 'ProfileService');
    } else {
      Logger.log(`Profile ${id} not found`, 'ProfileService');
    }

    return profile;
  }

  async follow(followingProfileId: string, followerProfileId: string) {
    const followedProfile = await this.prisma.profile.findFirst({
      where: {
        id: followingProfileId,
      },
    });

    const followerUser = await this.prisma.profile.findFirst({
      where: {
        id: followerProfileId,
      },
    });

    if (!followedProfile) {
      throw new Error(`Profile ${followingProfileId} not found`);
    }

    if (!followerUser) {
      throw new Error(`User for profile ${followerProfileId} not found`);
    }

    const follow = await this.prisma.profileFollow.create({
      data: {
        followingProfileId: followingProfileId,
        followerProfileId: followerProfileId,
        createdById: followerUser.id,
        updatedById: followerUser.id,
        accepted: followedProfile.isPublic,
      },
    });

    const notification = await this.prisma.notification.create({
      data: {
        type: 'FOLLOW',
        title: 'New Follower',
        message: `${followerUser.username} started following you.`,
        data: JSON.stringify({ profileId: followingProfileId }),
        createdById: followerUser.id,
        recipientId: followedProfile.id,
      },
    });

    Logger.log(`Notification ${notification.id} created`);

    Logger.log(
      `Profile ${followingProfileId} followed by profile ${followerProfileId}`,
      'ProfileService',
    );

    return follow;
  }

  async unfollow(followingProfileId: string, followerProfileId: string) {
    const follow = await this.prisma.profileFollow.delete({
      where: {
        followerProfileId_followingProfileId: {
          followerProfileId: followerProfileId,
          followingProfileId: followingProfileId,
        },
      },
    });

    Logger.log(
      `Profile ${followingProfileId} unfollowed by profile ${followerProfileId}`,
      'ProfileService',
    );

    return follow;
  }

  async acceptFollow(profileFollowId: string) {
    const follow = await this.prisma.profileFollow.update({
      where: {
        id: profileFollowId,
      },
      data: {
        accepted: true,
      },
    });

    Logger.log(`Profile follow ${profileFollowId} accepted`, 'ProfileService');

    return follow;
  }

  async setAcceptedFalse(profileFollowId: string) {
    const follow = await this.prisma.profileFollow.update({
      where: {
        id: profileFollowId,
      },
      data: {
        accepted: false,
      },
    });

    Logger.log(`Profile follow ${profileFollowId} set to not accepted`);

    return follow;
  }

  async rejectFollow(profileFollowId: string) {
    const follow = await this.prisma.profileFollow.delete({
      where: {
        id: profileFollowId,
      },
    });

    Logger.log(`Profile follow ${profileFollowId} rejected`, 'ProfileService');

    return follow;
  }

  async getFollowRequests(profileId: string) {
    const requests = await this.prisma.profileFollow.findMany({
      where: {
        followingProfileId: profileId,
        accepted: false,
      },
    });

    Logger.log(
      `Found ${requests.length} follow requests for profile ${profileId}`,
      'ProfileService',
    );

    return requests;
  }

  async getFollowers(profileId: string) {
    const followers = await this.prisma.profile.findMany({
      where: {
        following: {
          some: {
            followingProfileId: profileId,
          },
        },
      },
    });

    Logger.log(
      `Found ${followers.length} followers for profile ${profileId}`,
      'ProfileService',
    );

    return followers;
  }

  async getFollowing(profileId: string) {
    const following = await this.prisma.profile.findMany({
      where: {
        followers: {
          some: {
            followerProfileId: profileId,
          },
        },
      },
    });

    Logger.log(
      `Found ${following.length} following for profile ${profileId}`,
      'ProfileService',
    );

    return following;
  }

  async changeVisibility(profileId: string) {
    const profile = await this.prisma.profile.findFirst({
      where: {
        id: profileId,
      },
    });

    if (!profile) {
      throw new Error(`Profile ${profileId} not found`);
    }

    const updatedProfile = await this.prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        isPublic: !profile.isPublic,
      },
    });

    Logger.log(
      `Profile ${profileId} visibility changed to ${updatedProfile.isPublic}`,
      'ProfileService',
    );

    return updatedProfile;
  }
}
