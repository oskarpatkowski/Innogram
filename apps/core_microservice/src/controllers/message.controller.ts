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
import { CreateChatMessageDto } from '../../dto/create.message.dto';
import { UpdateChatMessageDto } from '../../dto/update.message.dto';
import type { AuthenticatedRequest } from '../guards/access.guard';
import { AccessGuard } from '../guards/access.guard';
import { MessageService } from '../services/message.service';

@Controller('messages')
@UseGuards(AccessGuard)
export class MessageControler {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(
    @Body() dto: CreateChatMessageDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return await this.messageService.create(
      dto,
      request.user.profileId,
      request.user.userId,
    );
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
