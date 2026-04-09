import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateProfileDto } from '../../dto/create.profile.dto';
import { UpdateProfileDto } from '../../dto/update.profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProfileDto) {
    return await this.prisma.profile.create({
      data: dto,
    });
  }

  async getById(id: string) {
    return await this.prisma.profile.findUnique({
      where: {
        id,
      },
    });
  }

  async getAll() {
    return await this.prisma.profile.findMany();
  }

  async update(id: string, profileDto: UpdateProfileDto) {
    return await this.prisma.profile.update({
      where: {
        id,
      },
      data: profileDto,
    });
  }

  async delete(id: string) {
    return await this.prisma.profile.delete({
      where: {
        id,
      },
    });
  }
}
