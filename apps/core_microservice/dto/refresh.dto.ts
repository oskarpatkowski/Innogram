import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  @IsString({ message: 'refreshToken must be a string' })
  @IsNotEmpty({ message: 'refreshToken is required' })
  @ApiProperty()
  refreshToken!: string;
}
