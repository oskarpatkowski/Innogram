import { IsNotEmpty, IsString } from 'class-validator';

export class OAuthDto {
  @IsString()
  @IsNotEmpty()
  ipAddress!: string;

  @IsString()
  @IsNotEmpty()
  userAgent!: string;
}
