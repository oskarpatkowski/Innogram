import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsEmail({}, { message: 'email must be valid' })
  @IsNotEmpty({ message: 'email is required' })
  @MaxLength(255, { message: 'email must be less than 255 characters' })
  @ApiProperty()
  email!: string;

  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password is required' })
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @MaxLength(255, { message: 'password must be less than 255 characters' })
  @ApiProperty()
  password!: string;

  @IsString({ message: 'username must be a string' })
  @IsNotEmpty({ message: 'username is required' })
  @ApiProperty()
  username!: string;

  @Type(() => Date)
  @IsDate({ message: 'birthdate must be a valid date' })
  @IsNotEmpty({ message: 'birthdate is required' })
  @ApiProperty()
  birthdate!: Date;

  @IsString({ message: 'useragent must be a string' })
  @IsNotEmpty({ message: 'useragent is required' })
  @ApiProperty()
  userAgent!: string;

  @IsString({ message: 'ipaddress must be a string' })
  @IsNotEmpty({ message: 'ipaddress is required' })
  @ApiProperty()
  ipAddress!: string;
}
