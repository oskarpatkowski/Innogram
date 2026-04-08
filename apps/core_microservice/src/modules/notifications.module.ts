import { Module } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { NotificationsService } from '../services/notification.service';

@Module({
  imports: [PrismaService],
  controllers: [],
  providers: [NotificationsService],
})
export class NotificationsModule {}
