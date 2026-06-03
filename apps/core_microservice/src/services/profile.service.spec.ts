import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from './prisma.service';
import { AuthService } from './auth.service';
import { CreateProfileDto } from '../../dto/create.profile.dto';

const profileCreate = jest.fn();
const profileFindUnique = jest.fn();
const profileFindMany = jest.fn();
const profileUpdate = jest.fn();
const profileDelete = jest.fn();
const profileFollowFindFirst = jest.fn();
const profileFollowCreate = jest.fn();
const profileFollowDelete = jest.fn();
const profileFollowUpdate = jest.fn();
const profileFollowFindMany = jest.fn();
const profileFollowUpdateMany = jest.fn();
const notificationCreate = jest.fn();
const authRevokeAllSessions = jest.fn();

const prismaMock = {
  profile: {
    create: profileCreate,
    findUnique: profileFindUnique,
    findMany: profileFindMany,
    update: profileUpdate,
    delete: profileDelete,
  },
  profileFollow: {
    findFirst: profileFollowFindFirst,
    create: profileFollowCreate,
    delete: profileFollowDelete,
    update: profileFollowUpdate,
    findMany: profileFollowFindMany,
    updateMany: profileFollowUpdateMany,
  },
  notification: {
    create: notificationCreate,
  },
};

const authServiceMock = {
  revokeAllSessions: authRevokeAllSessions,
};

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new profile', async () => {
      const createProfileDto = {
        username: 'testuser',
        bio: 'Test bio',
        userId: 'user1',
      };
      const expectedProfile = { id: 'profile1', ...createProfileDto };

      profileCreate.mockResolvedValue(expectedProfile);

      const result = await service.create(<CreateProfileDto>createProfileDto);

      expect(profileCreate).toHaveBeenCalledWith({ data: createProfileDto });
      expect(result).toEqual(expectedProfile);
    });
  });

  describe('getById', () => {
    it('should return a profile by id', async () => {
      const profileId = 'profile1';
      const expectedProfile = { id: profileId, username: 'testuser' };

      profileFindUnique.mockResolvedValue(expectedProfile);

      const result = await service.getById(profileId);

      expect(profileFindUnique).toHaveBeenCalledWith({
        where: { id: profileId },
      });
      expect(result).toEqual(expectedProfile);
    });

    it('should return null if profile not found', async () => {
      const profileId = 'nonexistent';
      profileFindUnique.mockResolvedValue(null);

      const result = await service.getById(profileId);

      expect(profileFindUnique).toHaveBeenCalledWith({
        where: { id: profileId },
      });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a profile', async () => {
      const profileId = 'profile1';
      const updateProfileDto = { bio: 'Updated bio' };
      const expectedProfile = { id: profileId, bio: 'Updated bio' };

      profileUpdate.mockResolvedValue(expectedProfile);

      const result = await service.update(profileId, updateProfileDto);

      expect(profileUpdate).toHaveBeenCalledWith({
        where: { id: profileId },
        data: updateProfileDto,
      });
      expect(result).toEqual(expectedProfile);
    });
  });

  describe('delete', () => {
    it('should delete a profile and revoke sessions', async () => {
      const profileId = 'profile1';
      const userId = 'user1';
      const profile = { id: profileId, userId, user: { id: userId } };

      profileFindUnique.mockResolvedValue(profile);
      profileDelete.mockResolvedValue(profile);
      authRevokeAllSessions.mockResolvedValue(undefined);

      const result = await service.delete(profileId);

      expect(profileFindUnique).toHaveBeenCalledWith({
        where: { id: profileId },
        include: { user: true },
      });
      expect(profileDelete).toHaveBeenCalledWith({ where: { id: profileId } });
      expect(authRevokeAllSessions).toHaveBeenCalledWith(userId);
      expect(result).toEqual(profile);
    });
  });

  describe('follow', () => {
    it('should allow a profile to follow another', async () => {
      const followingProfileId = 'profile1';
      const followerProfileId = 'profile2';
      const followerUser = {
        id: followerProfileId,
        userId: 'user2',
        username: 'follower',
      };
      const followedProfile = { id: followingProfileId, isPublic: true };
      const expectedFollow = { id: 'follow1' };

      profileFollowFindFirst.mockResolvedValue(null);
      profileFindUnique
        .mockResolvedValueOnce(followedProfile)
        .mockResolvedValueOnce(followerUser);
      profileFollowCreate.mockResolvedValue(expectedFollow);
      notificationCreate.mockResolvedValue({});

      const result = await service.follow(
        followingProfileId,
        followerProfileId,
      );

      expect(profileFollowCreate).toHaveBeenCalled();
      expect(notificationCreate).toHaveBeenCalled();
      expect(result).toEqual(expectedFollow);
    });
  });

  describe('unfollow', () => {
    it('should allow a profile to unfollow another', async () => {
      const followingProfileId = 'profile1';
      const followerProfileId = 'profile2';
      const expectedUnfollow = { id: 'follow1' };

      profileFollowDelete.mockResolvedValue(expectedUnfollow);

      const result = await service.unfollow(
        followingProfileId,
        followerProfileId,
      );

      expect(profileFollowDelete).toHaveBeenCalledWith({
        where: {
          followerProfileId_followingProfileId: {
            followerProfileId,
            followingProfileId,
          },
        },
      });
      expect(result).toEqual(expectedUnfollow);
    });
  });

  describe('acceptFollow', () => {
    it('should accept a follow request', async () => {
      const profileFollowId = 'follow1';
      const expectedFollow = { id: profileFollowId, accepted: true };

      profileFollowUpdate.mockResolvedValue(expectedFollow);

      const result = await service.acceptFollow(profileFollowId);

      expect(profileFollowUpdate).toHaveBeenCalledWith({
        where: { id: profileFollowId },
        data: { accepted: true },
      });
      expect(result).toEqual(expectedFollow);
    });
  });
});
