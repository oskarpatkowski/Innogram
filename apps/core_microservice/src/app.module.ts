import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    AuthModule,
    ChatsModule,
    CommentsModule,
    NotificationsModule,
    PostsModule,
    UsersModule,
    AssetsModule,
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, providePrismaClientExceptionFilter()],
  exports: [PrismaService],
})
export class AppModule {}
