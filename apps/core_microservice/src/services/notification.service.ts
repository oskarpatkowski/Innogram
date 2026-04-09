import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { CreateNotificationDto } from '../../dto/create.notification.dto';
import { UpdateNotificationDto } from '../../dto/update.notification.dto';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateNotificationDto) {
    return await this.prisma.notification.create({
      data: dto,
    });
  }

  async getById(id: string) {
    return await this.prisma.notification.findUnique({
      where: {
        id,
      },
    });
  }

  async getAll() {
    return await this.prisma.notification.findMany();
  }

  async update(id: string, notificationDto: UpdateNotificationDto) {
    return await this.prisma.notification.update({
      where: {
        id,
      },
      data: notificationDto,
    });
  }

  async delete(id: string) {
    return await this.prisma.notification.delete({
      where: {
        id,
      },
    });
  }
}
