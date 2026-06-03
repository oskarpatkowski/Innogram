import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/services/prisma.service';
import { AuthService } from '../src/services/auth.service';
import { ProfileService } from '../src/services/profile.service';
import { PostsService } from '../src/services/posts.service';
import { CommentsService } from '../src/services/comments.service';

describe('AppController (integration)', () => {
  let app: INestApplication;
  let httpServer: App;
  let authService: AuthService;
  let profileService: ProfileService;
  let postsService: PostsService;
  let commentsService: CommentsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        user: {
          create: jest.fn(),
          findUnique: jest.fn(),
        },
        profile: {
          create: jest.fn(),
          findUnique: jest.fn(),
          update: jest.fn(),
        },
        post: {
          create: jest.fn(),
          findUnique: jest.fn(),
        },
        comment: {
          create: jest.fn(),
          findUnique: jest.fn(),
        },
      })
      .overrideProvider(AuthService)
      .useValue({
        login: jest.fn(),
        register: jest.fn(),
        verify: jest.fn(),
      })
      .overrideProvider(ProfileService)
      .useValue({
        getById: jest.fn(),
        update: jest.fn(),
      })
      .overrideProvider(PostsService)
      .useValue({
        getById: jest.fn(),
        create: jest.fn(),
      })
      .overrideProvider(CommentsService)
      .useValue({
        getById: jest.fn(),
        create: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer() as App;

    authService = moduleFixture.get<AuthService>(AuthService);
    profileService = moduleFixture.get<ProfileService>(ProfileService);
    postsService = moduleFixture.get<PostsService>(PostsService);
    commentsService = moduleFixture.get<CommentsService>(CommentsService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(httpServer).get('/').expect(200).expect('Hello World!');
  });

  describe('Auth', () => {
    it('/auth/login (POST)', async () => {
      const loginDto = { username: 'test', password: 'password' };
      const expectedResponse = { accessToken: 'test-token' };

      (authService.login as jest.Mock).mockResolvedValue(expectedResponse);

      return request(httpServer)
        .post('/auth/login')
        .send(loginDto)
        .expect(201)
        .expect(expectedResponse);
    });

    it('/auth/signup (POST)', async () => {
      const signupDto = {
        username: 'test',
        password: 'password',
        email: 'test@example.com',
      };
      const expectedResponse = { accessToken: 'test-token' };

      (authService.register as jest.Mock).mockResolvedValue(expectedResponse);

      return request(httpServer)
        .post('/auth/signup')
        .send(signupDto)
        .expect(201)
        .expect(expectedResponse);
    });
  });

  describe('Profile', () => {
    it('/profiles/:id (GET)', async () => {
      const profileId = 'profile1';
      const expectedProfile = { id: profileId, username: 'testuser' };

      (profileService.getById as jest.Mock).mockResolvedValue(expectedProfile);

      return request(httpServer)
        .get(`/profiles/${profileId}`)
        .expect(200)
        .expect(expectedProfile);
    });

    it('/profiles/:id (PUT)', async () => {
      const profileId = 'profile1';
      const updateProfileDto = { bio: 'Updated bio' };
      const expectedProfile = { id: profileId, ...updateProfileDto };

      (profileService.update as jest.Mock).mockResolvedValue(expectedProfile);

      return request(httpServer)
        .put(`/profiles/${profileId}`)
        .send(updateProfileDto)
        .expect(200)
        .expect(expectedProfile);
    });
  });

  describe('Posts', () => {
    it('/posts/:id (GET)', async () => {
      const postId = 'post1';
      const expectedPost = { id: postId, content: 'Test post' };

      (postsService.getById as jest.Mock).mockResolvedValue(expectedPost);

      return request(httpServer)
        .get(`/posts/${postId}`)
        .expect(200)
        .expect(expectedPost);
    });

    it('/posts (POST)', async () => {
      const createPostDto = { content: 'New post' };
      const expectedPost = { id: 'post1', ...createPostDto };

      (postsService.create as jest.Mock).mockResolvedValue(expectedPost);

      return request(httpServer)
        .post('/posts')
        .send(createPostDto)
        .expect(201)
        .expect(expectedPost);
    });
  });

  describe('Comments', () => {
    it('/comments/:id (GET)', async () => {
      const commentId = 'comment1';
      const expectedComment = { id: commentId, content: 'Test comment' };

      (commentsService.getById as jest.Mock).mockResolvedValue(expectedComment);

      return request(httpServer)
        .get(`/comments/${commentId}`)
        .expect(200)
        .expect(expectedComment);
    });

    it('/comments (POST)', async () => {
      const createCommentDto = { content: 'New comment', postId: 'post1' };
      const expectedComment = { id: 'comment1', ...createCommentDto };

      (commentsService.create as jest.Mock).mockResolvedValue(expectedComment);

      return request(httpServer)
        .post('/comments')
        .send(createCommentDto)
        .expect(201)
        .expect(expectedComment);
    });
  });
});
