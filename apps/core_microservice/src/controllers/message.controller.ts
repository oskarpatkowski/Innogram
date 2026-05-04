import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { UpdateChatMessageDto } from '../../dto/update.message.dto';
import { CreateChatMessageDto } from '../../dto/create.message.dto';
import { AccessGuard } from '../guards/access.guard';

@Controller('messages')
@UseGuards(AccessGuard)
export class MessageControler {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(@Body() dto: CreateChatMessageDto) {
    return await this.messageService.create(dto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.messageService.getById(id);
  }

  @Get()
  async getAll() {
    return await this.messageService.getAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() messageDto: UpdateChatMessageDto,
  ) {
    return await this.messageService.update(id, messageDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.messageService.delete(id);
  }
}
