import { Provider } from '@innogram/database';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAccountDto {
  @IsString({ message: 'userId must be a string' })
  @IsNotEmpty({ message: 'userId is required' })
  @ApiProperty()
  userId!: string;

  @IsString({ message: 'email must be a string' })
  @MaxLength(255)
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'email must be a valid email' })
  @ApiProperty()
  email!: string;

  @IsNotEmpty({ message: 'passwordHash is required' })
  @IsString({ message: 'passwordHash must be a string' })
  @ApiProperty()
  passwordHash!: string;

  @IsEnum(Provider, { message: 'provider must be a valid provider' })
  @ApiProperty()
  provider!: Provider;

  @IsString({ message: 'providerId must be a string' })
  @IsNotEmpty({ message: 'providerId is required' })
  @ApiProperty()
  providerId!: string;

  @IsString({ message: 'createdById must be a string' })
  @IsNotEmpty({ message: 'createdById is required' })
  @ApiProperty()
  createdById!: string;
}
