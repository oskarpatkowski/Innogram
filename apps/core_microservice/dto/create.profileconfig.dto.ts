import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateProileConfigDto {
  @IsString({ message: 'configKey must be a string' })
  @IsNotEmpty({ message: 'configKey is required' })
  @ApiProperty()
  configKey!: string;

  @IsBoolean({ message: 'isAdminAccessibleOnly must be a boolean' })
  @IsNotEmpty({ message: 'isAdminAccessibleOnly is required' })
  @ApiProperty()
  isAdminAccessibleOnly!: boolean;

  @IsString({ message: 'createdById must be a string' })
  @IsNotEmpty({ message: 'createdById is required' })
  @ApiProperty()
  createdById!: string;
}
