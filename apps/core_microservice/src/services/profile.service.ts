import { Injectable, Logger } from '@nestjs/common';
import { CreateProfileDto } from '../../dto/create.profile.dto';
import { UpdateProfileDto } from '../../dto/update.profile.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProfileDto) {
    const profile = await this.prisma.profile.create({
      data: dto,
    });
    Logger.log(`Profile ${profile.id} created`, 'ProfileService');
    return profile;
  }

  async getById(id: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        id,
      },
    });

    if (profile) {
      Logger.log(`Profile ${profile.id} found`, 'ProfileService');
    } else {
      Logger.log(`Profile ${id} not found`, 'ProfileService');
    }

    return profile;
  }

  async getAll() {
    const profiles = await this.prisma.profile.findMany();

    if (profiles.length > 0) {
      Logger.log(`Found ${profiles.length} profiles`, 'ProfileService');
    } else {
      Logger.log(`No profiles found`, 'ProfileService');
    }

    return profiles;
  }

  async update(id: string, profileDto: UpdateProfileDto) {
    const profile = await this.prisma.profile.update({
      where: {
        id,
      },
      data: profileDto,
    });

    Logger.log(`Profile ${profile.id} updated`, 'ProfileService');

    return profile;
  }

  async delete(id: string) {
    const profile = await this.prisma.profile.delete({
      where: {
        id,
      },
    });

    if (profile) {
      Logger.log(`Profile ${profile.id} deleted`, 'ProfileService');
    } else {
      Logger.log(`Profile ${id} not found`, 'ProfileService');
    }

    return profile;
  }
}
