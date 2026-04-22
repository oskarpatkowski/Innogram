import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OAuthDto {
  @IsString({ message: 'ipAddress must be a string' })
  @IsNotEmpty({ message: 'ipAddress is required' })
  @ApiProperty()
  ipAddress!: string;

  @IsString({ message: 'userAgent must be a string' })
  @IsNotEmpty({ message: 'userAgent is required' })
  @ApiProperty()
  userAgent!: string;
}
