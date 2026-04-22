import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProfileDto {
  @IsString({ message: 'userId must be a string' })
  @IsNotEmpty({ message: 'userId is required' })
  @ApiProperty()
  userId!: string;

  @IsNotEmpty({ message: 'username is required' })
  @IsString({ message: 'username must be a string' })
  @MaxLength(50)
  @ApiProperty()
  username!: string;

  @IsNotEmpty({ message: 'displayName is required' })
  @IsString({ message: 'displayName must be a string' })
  @MaxLength(100)
  @ApiProperty()
  displayName!: string;

  @IsDate({ message: 'birthday must be a valid date' })
  @IsNotEmpty({ message: 'birthday is required' })
  @ApiProperty()
  birthday!: Date;

  @IsNotEmpty({ message: 'bio is required' })
  @IsString({ message: 'bio must be a string' })
  @ApiProperty()
  bio!: string;

  @IsOptional()
  @IsString({ message: 'avatarUrl must be a string' })
  @MaxLength(500, { message: 'avatarUrl must be less than 500 characters' })
  @ApiProperty()
  avatarUrl?: string;

  @IsOptional()
  @IsBoolean({ message: 'isPublic must be a boolean' })
  @ApiProperty()
  isPublic?: boolean;

  @IsString({ message: 'createdById must be a string' })
  @IsNotEmpty({ message: 'createdById is required' })
  @ApiProperty()
  createdById!: string;
}
