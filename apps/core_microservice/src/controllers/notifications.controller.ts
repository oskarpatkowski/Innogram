import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateNotificationDto } from '../../dto/create.notification.dto';
import { UpdateNotificationDto } from '../../dto/update.notification.dto';
import { AccessGuard } from '../guards/access.guard';
import { NotificationsService } from '../services/notification.service';

@Controller('notifications')
@UseGuards(AccessGuard)
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
