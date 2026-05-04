import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'email must be a string' })
  @IsNotEmpty({ message: 'email is required' })
  @ApiProperty()
  email!: string;

  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password is required' })
  @ApiProperty()
  password!: string;

  @IsString({ message: 'ipAddress must be a string' })
  @IsNotEmpty({ message: 'ipAddress is required' })
  @ApiProperty()
  ipAddress!: string;

  @IsString({ message: 'userAgent must be a string' })
  @IsNotEmpty({ message: 'userAgent is required' })
  @ApiProperty()
  userAgent!: string;
}
