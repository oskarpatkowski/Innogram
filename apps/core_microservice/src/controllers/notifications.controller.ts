import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { NotificationsService } from '../services/notification.service';
import { CreateNotificationDto } from '../../dto/create.notification.dto';
import { UpdateNotificationDto } from '../../dto/update.notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async create(@Body() dto: CreateNotificationDto) {
    return await this.notificationsService.create(dto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.notificationsService.getById(id);
  }

  @Get()
  async getAll() {
    return await this.notificationsService.getAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() notificationDto: UpdateNotificationDto,
  ) {
    return await this.notificationsService.update(id, notificationDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.notificationsService.delete(id);
  }
}
