import {
  Body,
  Put,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { ProfileConfigService } from '../services/profile.config.service';
import { CreateProileConfigDto } from '../../dto/create.profileconfig.dto';
import { UpdateProfileConfigDto } from '../../dto/update.profileconfig.dto';

@Controller('profile-configs')
export class ProfileConfigController {
  constructor(private readonly profileConfigService: ProfileConfigService) {}

  @Post()
  create(@Body() dto: CreateProileConfigDto) {
    return this.profileConfigService.create(dto);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.profileConfigService.getById(id);
  }

  @Get()
  getAll() {
    return this.profileConfigService.getAll();
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() profileConfigDto: UpdateProfileConfigDto,
  ) {
    return this.profileConfigService.update(id, profileConfigDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.profileConfigService.delete(id);
  }
}
