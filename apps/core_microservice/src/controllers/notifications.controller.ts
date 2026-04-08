import { Controller } from '@nestjs/common';
import { NotificationsService } from '../services/notification.service';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
}
