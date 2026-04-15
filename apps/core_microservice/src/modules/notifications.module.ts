import { Module } from '@nestjs/common';
import { NotificationsService } from '../services/notification.service';
import { PrismaService } from '../services/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [],
  providers: [NotificationsService, PrismaService, ConfigService],
})
export class NotificationsModule {}
