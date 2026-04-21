import { Role } from '@innogram/database';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsBoolean()
  @IsOptional()
  disabled?: boolean;
}
