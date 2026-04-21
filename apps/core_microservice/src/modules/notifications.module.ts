import { Module } from '@nestjs/common';
import { NotificationsService } from '../services/notification.service';
import { PrismaService } from '../services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { NotificationsController } from '../controllers/notifications.controller';

@Module({
  imports: [],
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService, ConfigService],
})
export class NotificationsModule {}
