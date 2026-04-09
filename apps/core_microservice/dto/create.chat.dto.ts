import { Type } from '@prisma/client';
import { IsString, IsNotEmpty, MaxLength, IsEnum } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(Type)
  type?: Type;

  @IsString()
  @IsNotEmpty()
  createdById!: string;
}
