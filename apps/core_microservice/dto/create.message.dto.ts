import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatMessageDto {
  @IsString({ message: 'chatId must be a string' })
  @IsNotEmpty({ message: 'chatId is required' })
  @ApiProperty()
  chatId!: string;

  @IsString({ message: 'content must be a string' })
  @IsNotEmpty({ message: 'content is required' })
  @ApiProperty()
  content!: string;

  @IsString({ message: 'replyToMessageId must be a string' })
  @IsOptional()
  @ApiProperty()
  replyToMessageId?: string;

  @IsArray({ message: 'assetIds must be an array' })
  @IsString({ each: true, message: 'assetIds must be an array of strings' })
  @IsOptional()
  @ApiProperty({ required: false })
  assetIds?: string[];
}
