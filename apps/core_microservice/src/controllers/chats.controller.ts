import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateChatDto } from '../../dto/create.chat.dto';
import { UpdateChatDto } from '../../dto/update.chat.dto';
import type { AuthenticatedRequest } from '../guards/access.guard';
import { AccessGuard } from '../guards/access.guard';
import { ChatsService } from '../services/chats.service';

@Controller('chats')
@UseGuards(AccessGuard)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  async create(
    @Body() dto: CreateChatDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return await this.chatsService.create(dto, request.user.profileId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.chatsService.getById(id);
  }

  @Get()
  async getAll() {
    return await this.chatsService.getAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() chatDto: UpdateChatDto) {
    return await this.chatsService.update(id, chatDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.chatsService.delete(id);
  }
}
