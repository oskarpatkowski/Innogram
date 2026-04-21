import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatMessageDto {
  @IsString()
  @IsNotEmpty()
  chatId!: string;

  @IsString()
  @IsNotEmpty()
  profileId!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  replyToMessageId?: string;

  @IsString()
  @IsNotEmpty()
  createdById!: string;
}
