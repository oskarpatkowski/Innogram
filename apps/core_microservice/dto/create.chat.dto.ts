import { Type } from '@innogram/database';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

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
