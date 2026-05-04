import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatMessageDto {
  @IsString({ message: 'chatId must be a string' })
  @IsNotEmpty({ message: 'chatId is required' })
  @ApiProperty()
  chatId!: string;

  @IsString({ message: 'profileId must be a string' })
  @IsNotEmpty({ message: 'profileId is required' })
  @ApiProperty()
  profileId!: string;

  @IsString({ message: 'content must be a string' })
  @IsNotEmpty({ message: 'content is required' })
  @ApiProperty()
  content!: string;

  @IsString({ message: 'replyToMessageId must be a string' })
  @IsOptional()
  @ApiProperty()
  replyToMessageId?: string;

  @IsString({ message: 'createdById must be a string' })
  @IsNotEmpty({ message: 'createdById is required' })
  @ApiProperty()
  createdById!: string;
}
