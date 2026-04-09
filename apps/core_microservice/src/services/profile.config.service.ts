import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UpdateProfileConfigDto } from '../../dto/update.profileconfig.dto';
import { CreateProileConfigDto } from '../../dto/create.profileconfig.dto';

@Injectable()
export class ProfileConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProileConfigDto) {
    return await this.prisma.profileConfiguration.create({
      data: dto,
    });
  }

  async getById(id: string) {
    return await this.prisma.profileConfiguration.findUnique({
      where: {
        id,
      },
    });
  }

  async getAll() {
    return await this.prisma.profileConfiguration.findMany();
  }

  async update(id: string, profileConfigDto: UpdateProfileConfigDto) {
    return await this.prisma.profileConfiguration.update({
      where: {
        id,
      },
      data: profileConfigDto,
    });
  }

  async delete(id: string) {
    return await this.prisma.profileConfiguration.delete({
      where: {
        id,
      },
    });
  }
}
