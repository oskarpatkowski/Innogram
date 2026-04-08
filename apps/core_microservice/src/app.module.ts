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

@Module({
  imports: [
    AuthModule,
    ChatsModule,
    CommentsModule,
    NotificationsModule,
    PostsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
