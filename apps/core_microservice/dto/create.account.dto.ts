import { Provider } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  passwordHash!: string;

  @IsEnum(Provider)
  provider!: Provider;

  @IsString()
  providerId!: string;

  @IsString()
  createdById!: string;
}
