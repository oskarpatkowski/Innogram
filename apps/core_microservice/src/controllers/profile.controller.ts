import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateProfileDto } from '../../dto/create.profile.dto';
import { UpdateProfileDto } from '../../dto/update.profile.dto';
import type { AuthenticatedRequest } from '../guards/access.guard';
import { AccessGuard } from '../guards/access.guard';
import { ProfileService } from '../services/profile.service';

@Controller('profiles')
@UseGuards(AccessGuard)
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

  @Post('/follow/:followingProfileId')
  async follow(
    @Param('followingProfileId') followingProfileId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return await this.profileService.follow(
      followingProfileId,
      request.user.profileId,
    );
  }

  @Delete('/unfollow/:followingProfileId')
  async unfollow(
    @Param('followingProfileId') followingProfileId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return await this.profileService.unfollow(
      followingProfileId,
      request.user.profileId,
    );
  }

  @Patch('/accept/:profileFollowId')
  async acceptFollow(@Param('profileFollowId') profileFollowId: string) {
    return await this.profileService.acceptFollow(profileFollowId);
  }

  @Patch('/reject/:profileFollowId')
  async rejectFollow(@Param('profileFollowId') profileFollowId: string) {
    return await this.profileService.setAcceptedFalse(profileFollowId);
  }

  @Get('/follow-requests')
  async getFollowRequests(@Req() request: AuthenticatedRequest) {
    return await this.profileService.getFollowRequests(request.user.profileId);
  }
}
