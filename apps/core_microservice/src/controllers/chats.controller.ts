import { Controller } from '@nestjs/common';
import { ChatsService } from '../services/chats.service';

@Controller()
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}
}
