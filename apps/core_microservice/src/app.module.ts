import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './services/prisma.service';
import { AuthModule } from './modules/auth.module';
import { ChatsModule } from './modules/chats.module';
import { CommentsModule } from './modules/comments.module';
import { NotificationsModule } from './modules/notifications.module';
import { PostsModule } from './modules/posts.module';
import { UsersModule } from './modules/users.module';
import { ConfigModule } from '@nestjs/config';
import { AssetsModule } from './modules/assets.module';

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
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
