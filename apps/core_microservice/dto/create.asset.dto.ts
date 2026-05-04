import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAssetDto {
  @IsString({ message: 'fileName must be a string' })
  @IsNotEmpty({ message: 'fileName is required' })
  @ApiProperty()
  fileName!: string;

  @IsString({ message: 'filePath must be a string' })
  @IsNotEmpty({ message: 'filePath is required' })
  @ApiProperty()
  filePath!: string;

  @IsString({ message: 'fileType must be a string' })
  @IsNotEmpty({ message: 'fileType is required' })
  @ApiProperty()
  fileType!: string;

  @IsInt({ message: 'fileSize must be a number' })
  @IsNotEmpty({ message: 'fileSize is required' })
  @ApiProperty()
  fileSize!: number;

  @IsInt({ message: 'orderIndex must be a number' })
  @IsOptional()
  @ApiProperty()
  orderIndex?: number;

  @IsString({ message: 'createdById must be a string' })
  @IsNotEmpty({ message: 'createdById is required' })
  @ApiProperty()
  createdById!: string;
}
