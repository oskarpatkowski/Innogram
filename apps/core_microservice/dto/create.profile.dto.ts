import {
  IsBoolean,
  isDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  username!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  displayName!: string;

  birthday!: Date;

  @IsNotEmpty()
  @IsString()
  bio!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatarUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsString()
  createdById!: string;
}
