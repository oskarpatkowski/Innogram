import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'content must be a string' })
  @IsNotEmpty({ message: 'content is required' })
  @ApiProperty()
  content!: string;

  @IsArray({ message: 'assetIds must be an array' })
  @IsOptional()
  @ApiProperty({ required: false })
  assetIds?: string[];
}
