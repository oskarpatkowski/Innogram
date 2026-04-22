import { Role } from '@innogram/database';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEnum(Role, { message: 'role must be a valid role' })
  @IsOptional()
  @ApiProperty()
  role?: Role;

  @IsBoolean({ message: 'disabled must be a boolean' })
  @IsOptional()
  @ApiProperty()
  disabled?: boolean;
}
