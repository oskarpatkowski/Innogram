import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @IsString()
  @IsNotEmpty()
  filePath!: string;

  @IsString()
  @IsNotEmpty()
  fileType!: string;

  @IsInt()
  fileSize!: number;

  @IsInt()
  @IsOptional()
  orderIndex?: number;

  @IsString()
  @IsNotEmpty()
  createdById!: string;
}
