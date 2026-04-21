import { Injectable, Logger } from '@nestjs/common';
import { CreateProileConfigDto } from '../../dto/create.profileconfig.dto';
import { UpdateProfileConfigDto } from '../../dto/update.profileconfig.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class ProfileConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProileConfigDto) {
    const config = await this.prisma.profileConfiguration.create({
      data: dto,
    });
    Logger.log(
      `ProfileConfiguration ${config.id} created`,
      'ProfileConfigService',
    );
    return config;
  }

  async getById(id: string) {
    const config = await this.prisma.profileConfiguration.findUnique({
      where: {
        id,
      },
    });

    if (config) {
      Logger.log(
        `ProfileConfiguration ${config.id} found`,
        'ProfileConfigService',
      );
    } else {
      Logger.log(
        `ProfileConfiguration ${id} not found`,
        'ProfileConfigService',
      );
    }

    return config;
  }

  async getAll() {
    const configs = await this.prisma.profileConfiguration.findMany();

    if (configs.length > 0) {
      Logger.log(
        `Found ${configs.length} profile configurations`,
        'ProfileConfigService',
      );
    } else {
      Logger.log(`No profile configurations found`, 'ProfileConfigService');
    }

    return configs;
  }

  async update(id: string, profileConfigDto: UpdateProfileConfigDto) {
    const config = await this.prisma.profileConfiguration.update({
      where: {
        id,
      },
      data: profileConfigDto,
    });

    Logger.log(
      `ProfileConfiguration ${config.id} updated`,
      'ProfileConfigService',
    );

    return config;
  }

  async delete(id: string) {
    const config = await this.prisma.profileConfiguration.delete({
      where: {
        id,
      },
    });

    if (config) {
      Logger.log(
        `ProfileConfiguration ${config.id} deleted`,
        'ProfileConfigService',
      );
    } else {
      Logger.log(
        `ProfileConfiguration ${id} not found`,
        'ProfileConfigService',
      );
    }

    return config;
  }
}
