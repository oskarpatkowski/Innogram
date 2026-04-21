import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationsController } from '../controllers/notifications.controller';
import { AuthService } from '../services/auth.service';
import { NotificationsService } from '../services/notification.service';
import { PrismaService } from '../services/prisma.service';

@Module({
  imports: [],
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService, ConfigService, AuthService],
})
export class NotificationsModule {}
