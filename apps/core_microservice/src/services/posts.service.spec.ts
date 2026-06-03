import { PostsService } from './posts.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

const postCreate = jest.fn();
const postFindMany = jest.fn();
const postFindFirst = jest.fn();
const postUpdate = jest.fn();
const postDelete = jest.fn();
const profileFindMany = jest.fn();
const profileFindFirst = jest.fn();
const notificationCreate = jest.fn();
const postMentionCreate = jest.fn();
const postAssetCreate = jest.fn();
const postAssetDeleteMany = jest.fn();
const postAssetCreateMany = jest.fn();
const postAssetFindMany = jest.fn();
const postLikeCreate = jest.fn();
const postLikeDelete = jest.fn();
const postLikeFindMany = jest.fn();
const transaction = jest.fn();

const prismaMock = {
  post: {
    create: postCreate,
    findMany: postFindMany,
    findFirst: postFindFirst,
    update: postUpdate,
    delete: postDelete,
  },
  profile: {
    findMany: profileFindMany,
    findFirst: profileFindFirst,
  },
  notification: {
    create: notificationCreate,
  },
  postMention: {
    create: postMentionCreate,
  },
  postAsset: {
    create: postAssetCreate,
    deleteMany: postAssetDeleteMany,
    createMany: postAssetCreateMany,
    findMany: postAssetFindMany,
  },
  postLike: {
    create: postLikeCreate,
    delete: postLikeDelete,
    findMany: postLikeFindMany,
  },
  $transaction: transaction,
};

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    transaction.mockImplementation(
      (callback: (prisma: typeof prismaMock) => Promise<unknown>) =>
        callback(prismaMock),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);

    postCreate.mockClear();
    postFindMany.mockClear();
    postFindFirst.mockClear();
    postUpdate.mockClear();
    postDelete.mockClear();
    profileFindMany.mockClear();
    profileFindFirst.mockClear();
    notificationCreate.mockClear();
    postMentionCreate.mockClear();
    postAssetCreate.mockClear();
    postAssetDeleteMany.mockClear();
    postAssetCreateMany.mockClear();
    postAssetFindMany.mockClear();
    postLikeCreate.mockClear();
    postLikeDelete.mockClear();
    postLikeFindMany.mockClear();
    transaction.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const createPostDto = { content: 'Test post' };
      const userId = 'user1';
      const profileId = 'profile1';
      const post = {
        id: 'post1',
        ...createPostDto,
        createdById: userId,
        profileId,
      };

      postCreate.mockResolvedValue(post);

      const result = await service.create(createPostDto, userId, profileId);

      expect(postCreate).toHaveBeenCalledWith({
        data: {
          content: createPostDto.content,
          createdById: userId,
          profileId: profileId,
        },
      });
      expect(result).toEqual(post);
    });

    it('should create a post with assets', async () => {
      const createPostDto = { content: 'Test post', assetIds: ['asset1'] };
      const userId = 'user1';
      const profileId = 'profile1';
      const post = {
        id: 'post1',
        ...createPostDto,
        createdById: userId,
        profileId,
      };

      postCreate.mockResolvedValue(post);
      postAssetCreate.mockResolvedValue({});

      const result = await service.create(createPostDto, userId, profileId);

      expect(postCreate).toHaveBeenCalledWith({
        data: {
          content: createPostDto.content,
          createdById: userId,
          profileId: profileId,
        },
      });
      expect(postAssetCreate).toHaveBeenCalledWith({
        data: {
          assetId: 'asset1',
          postId: 'post1',
          createdById: userId,
        },
      });
      expect(result).toEqual(post);
    });

    it('should handle mentions', async () => {
      const createPostDto = { content: 'Test post @username' };
      const userId = 'user1';
      const profileId = 'profile1';
      const post = {
        id: 'post1',
        ...createPostDto,
        createdById: userId,
        profileId,
      };
      const mentionedProfile = { id: 'profile2', userId: 'user2' };

      postCreate.mockResolvedValue(post);
      profileFindMany.mockResolvedValue([mentionedProfile]);
      notificationCreate.mockResolvedValue({});
      postMentionCreate.mockResolvedValue({});

      await service.create(createPostDto, userId, profileId);

      await new Promise((resolve) => process.nextTick(resolve));

      expect(profileFindMany).toHaveBeenCalled();
      expect(notificationCreate).toHaveBeenCalled();
      expect(postMentionCreate).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatePostDto = { content: 'Updated post' };
      const postId = 'post1';
      const userId = 'user1';
      const updatedPost = { id: postId, ...updatePostDto };

      postUpdate.mockResolvedValue(updatedPost);
      postAssetFindMany.mockResolvedValue([]);

      const result = await service.update(postId, updatePostDto, userId);

      expect(postUpdate).toHaveBeenCalledWith({
        where: { id: postId },
        data: { content: updatePostDto.content },
      });
      expect(result).toEqual(updatedPost);
    });
  });

  describe('delete', () => {
    it('should delete a post', async () => {
      const postId = 'post1';
      const deletedPost = { id: postId };

      postDelete.mockResolvedValue(deletedPost);

      const result = await service.delete(postId);

      expect(postDelete).toHaveBeenCalledWith({
        where: { id: postId },
      });
      expect(result).toEqual(deletedPost);
    });
  });

  describe('getById', () => {
    it('should return a post by id', async () => {
      const postId = 'post1';
      const post = { id: postId, profile: { isPublic: true } };

      postFindFirst.mockResolvedValue(post);

      const result = await service.getById(postId);

      expect(postFindFirst).toHaveBeenCalledWith({
        where: {
          id: postId,
          OR: [{ isArchived: false }, { profileId: undefined }],
        },
        include: {
          postAssets: {
            include: {
              asset: true,
            },
          },
          profile: true,
        },
      });
      expect(result).toEqual(post);
    });
  });

  describe('like', () => {
    it('should allow a user to like a post', async () => {
      const postId = 'post1';
      const profileId = 'profile1';
      const user = { userId: 'user1' };
      const like = { id: 'like1', postId, profileId };

      profileFindFirst.mockResolvedValue(user);
      postLikeCreate.mockResolvedValue(like);

      const result = await service.like(postId, profileId);

      expect(postLikeCreate).toHaveBeenCalledWith({
        data: {
          postId,
          profileId,
          createdById: user.userId,
          updatedById: user.userId,
        },
      });
      expect(result).toEqual(like);
    });
  });

  describe('unlike', () => {
    it('should allow a user to unlike a post', async () => {
      const postId = 'post1';
      const profileId = 'profile1';
      const unlike = { id: 'like1', postId, profileId };

      postLikeDelete.mockResolvedValue(unlike);

      const result = await service.unlike(postId, profileId);

      expect(postLikeDelete).toHaveBeenCalledWith({
        where: {
          postId_profileId: {
            postId,
            profileId,
          },
        },
      });
      expect(result).toEqual(unlike);
    });
  });

  describe('setPostAsArchived', () => {
    it('should set a post as archived', async () => {
      const postId = 'post1';
      const archivedPost = { id: postId, isArchived: true };

      postUpdate.mockResolvedValue(archivedPost);

      const result = await service.setPostAsArchived(postId);

      expect(postUpdate).toHaveBeenCalledWith({
        where: { id: postId },
        data: { isArchived: true },
      });
      expect(result).toEqual(archivedPost);
    });
  });

  describe('setPostAsUnarchived', () => {
    it('should set a post as unarchived', async () => {
      const postId = 'post1';
      const unarchivedPost = { id: postId, isArchived: false };

      postUpdate.mockResolvedValue(unarchivedPost);

      const result = await service.setPostAsUnarchived(postId);

      expect(postUpdate).toHaveBeenCalledWith({
        where: { id: postId },
        data: { isArchived: false },
      });
      expect(result).toEqual(unarchivedPost);
    });
  });

  describe('getLikes', () => {
    it('should return the likes of a post', async () => {
      const postId = 'post1';
      const likes = [{ id: 'like1', postId, profileId: 'profile1' }];

      postLikeFindMany.mockResolvedValue(likes);

      const result = await service.getLikes(postId);

      expect(postLikeFindMany).toHaveBeenCalledWith({
        where: { postId },
      });
      expect(result).toEqual(likes);
    });
  });
});
