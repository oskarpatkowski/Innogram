import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { CreateProfileDto } from '../../dto/create.profile.dto';
import { UpdateProfileDto } from '../../dto/update.profile.dto';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  async create(@Body() profileDto: CreateProfileDto) {
    return await this.profileService.create(profileDto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.profileService.getById(id);
  }

  @Get()
  async getAll() {
    return await this.profileService.getAll();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() profileDto: UpdateProfileDto) {
    return await this.profileService.update(id, profileDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.profileService.delete(id);
  }
}
