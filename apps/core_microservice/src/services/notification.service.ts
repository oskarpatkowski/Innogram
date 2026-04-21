import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { CreateNotificationDto } from '../../dto/create.notification.dto';
import { UpdateNotificationDto } from '../../dto/update.notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: dto,
    });
    Logger.log(
      `Notification ${notification.id} created`,
      'NotificationsService',
    );
    return notification;
  }

  async getById(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    });

    if (notification) {
      Logger.log(
        `Notification ${notification.id} found`,
        'NotificationsService',
      );
    } else {
      Logger.log(`Notification ${id} not found`, 'NotificationsService');
    }

    return notification;
  }

  async getAll() {
    const notifications = await this.prisma.notification.findMany();

    if (notifications.length > 0) {
      Logger.log(
        `Found ${notifications.length} notifications`,
        'NotificationsService',
      );
    } else {
      Logger.log(`No notifications found`, 'NotificationsService');
    }

    return notifications;
  }

  async update(id: string, notificationDto: UpdateNotificationDto) {
    const notification = await this.prisma.notification.update({
      where: {
        id,
      },
      data: notificationDto,
    });

    Logger.log(
      `Notification ${notification.id} updated`,
      'NotificationsService',
    );

    return notification;
  }

  async delete(id: string) {
    const notification = await this.prisma.notification.delete({
      where: {
        id,
      },
    });

    if (notification) {
      Logger.log(
        `Notification ${notification.id} deleted`,
        'NotificationsService',
      );
    } else {
      Logger.log(`Notification ${id} not found`, 'NotificationsService');
    }

    return notification;
  }
}
