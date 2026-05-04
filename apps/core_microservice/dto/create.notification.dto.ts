import { NotificationType } from '@innogram/database';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateNotificationDto {
  @IsEnum(NotificationType, { message: 'type must be a valid type' })
  @ApiProperty()
  type!: NotificationType;

  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title is required' })
  @MaxLength(255)
  @ApiProperty()
  title!: string;

  @IsString({ message: 'message must be a string' })
  @IsNotEmpty({ message: 'message is required' })
  @ApiProperty()
  message!: string;

  @IsJSON({ message: 'data must be a valid JSON' })
  @ApiProperty()
  data!: string;

  @IsString({ message: 'createdById must be a string' })
  @IsNotEmpty({ message: 'createdById is required' })
  @ApiProperty()
  createdById!: string;
}
