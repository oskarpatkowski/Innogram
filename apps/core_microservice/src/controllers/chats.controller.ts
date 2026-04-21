import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ChatsService } from '../services/chats.service';
import { CreateChatDto } from '../../dto/create.chat.dto';
import { UpdateChatDto } from '../../dto/update.chat.dto';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  async create(@Body() dto: CreateChatDto) {
    return await this.chatsService.create(dto);
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
