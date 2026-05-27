import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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

  @Get('/following/:id')
  async getFollowingById(@Param('id') id: string) {
    return await this.profileService.getFollowing(id);
  }

  @Get('/followers/:id')
  async getFollowersById(@Param('id') id: string) {
    return await this.profileService.getFollowers(id);
  }

  @Get('/following')
  async getFollowing(@Req() request: AuthenticatedRequest) {
    return await this.profileService.getFollowing(request.user.profileId);
  }

  @Get('/followers')
  async getFollowers(@Req() request: AuthenticatedRequest) {
    return await this.profileService.getFollowers(request.user.profileId);
  }

  @Get('/me')
  async getMe(@Req() request: AuthenticatedRequest) {
    return await this.profileService.getById(request.user.profileId);
  }

  @Get('/username/:username')
  async getIdByUsername(@Param('username') username: string) {
    const profileId = await this.profileService.getIdByUsername(username);
    if (!profileId) {
      throw new NotFoundException(
        `Profile with username ${username} not found`,
      );
    }
    return profileId;
  }

  @Get('/follow-requests')
  async getFollowRequests(@Req() request: AuthenticatedRequest) {
    return await this.profileService.getFollowRequests(request.user.profileId);
  }

  @Get('/follow-requests/pending/:followingProfileId')
  async getPendingFollowRequest(
    @Param('followingProfileId') followingProfileId: string,
    @Req() request: AuthenticatedRequest,
  ) {
    return await this.profileService.getPendingFollowRequest(
      request.user.profileId,
      followingProfileId,
    );
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const profile = await this.profileService.getById(id);
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
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

  @Patch('/ignore/:profileFollowId')
  async rejectFollow(@Param('profileFollowId') profileFollowId: string) {
    return await this.profileService.setAcceptedFalse(profileFollowId);
  }

  @Patch('/visibility')
  async changeVisibility(@Req() request: AuthenticatedRequest) {
    return await this.profileService.changeVisibility(request.user.profileId);
  }

  @Delete('/reject/:profileFollowId')
  async deleteRequest(@Param('profileFollowId') profileFollowId: string) {
    return await this.profileService.rejectFollow(profileFollowId);
  }
}
