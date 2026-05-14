import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'postId must be a string' })
  @IsNotEmpty({ message: 'postId is required' })
  @ApiProperty()
  postId!: string;

  @IsOptional()
  @IsString({ message: 'parentCommentId must be a string' })
  @IsNotEmpty({ message: 'parentCommentId is required' })
  @ApiProperty()
  parentCommentId?: string;

  @IsString({ message: 'content must be a string' })
  @IsNotEmpty({ message: 'content is required' })
  @ApiProperty()
  content!: string;
}
