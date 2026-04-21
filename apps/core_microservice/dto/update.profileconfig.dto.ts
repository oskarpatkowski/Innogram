import { PartialType } from '@nestjs/swagger';
import { CreateProileConfigDto } from './create.profileconfig.dto';

export class UpdateProfileConfigDto extends PartialType(
  CreateProileConfigDto,
) {}
