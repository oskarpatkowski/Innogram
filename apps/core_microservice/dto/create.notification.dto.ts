import { NotificationType } from '@innogram/database';
import {
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateNotificationDto {
  @IsEnum(NotificationType)
  type!: NotificationType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsJSON()
  data!: string;

  @IsString()
  @IsNotEmpty()
  createdById!: string;
}
