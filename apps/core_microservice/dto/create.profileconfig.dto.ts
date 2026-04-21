import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateProileConfigDto {
  @IsString()
  @IsNotEmpty()
  configKey!: string;

  @IsBoolean()
  isAdminAccessibleOnly!: boolean;

  @IsString()
  @IsNotEmpty()
  createdById!: string;
}
