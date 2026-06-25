import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import { providePrismaClientExceptionFilter } from 'nestjs-prisma';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssetsModule } from './modules/assets.module';
import { AuthModule } from './modules/auth.module';
import { ChatsModule } from './modules/chats.module';
import { CommentsModule } from './modules/comments.module';
import { NotificationsModule } from './modules/notifications.module';
import { PostsModule } from './modules/posts.module';
import { UsersModule } from './modules/users.module';
import { PrismaService } from './services/prisma.service';
import { HealthModule } from './health/health.module';
import { PerformanceModule } from './modules/performance.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PerformanceInterceptor } from './interceptors/performance.interceptor';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    AuthModule,
    ChatsModule,
    CommentsModule,
    NotificationsModule,
    PostsModule,
    UsersModule,
    AssetsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
      },
    }),
    HealthModule,
    PerformanceModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST') || 'localhost';
        const port = configService.get<number>('REDIS_PORT') || 6379;
        const password = configService.get<string>('REDIS_PASSWORD') || '';

        let redisUri = `redis://${host}:${port}`;
        if (password) {
          redisUri = `redis://:${password}@${host}:${port}`;
        }

        return {
          stores: [new KeyvRedis(redisUri)],
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    providePrismaClientExceptionFilter(),
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [PrismaService],
})
export class AppModule {}
