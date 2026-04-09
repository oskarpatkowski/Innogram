import { PartialType } from '@nestjs/swagger';
import { CreateChatMessageDto } from './create.message.dto';

export class UpdateChatMessageDto extends PartialType(CreateChatMessageDto) {}
