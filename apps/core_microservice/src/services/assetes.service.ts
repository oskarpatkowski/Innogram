import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateAssetDto } from '../../dto/create.asset.dto';
import { UpdateAssetDto } from '../../dto/update.asset.dto';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAssetDto) {
    return await this.prisma.assets.create({
      data: dto,
    });
  }

  async getById(id: string) {
    return await this.prisma.assets.findUnique({
      where: {
        id,
      },
    });
  }

  async getAll() {
    return await this.prisma.assets.findMany();
  }

  async update(id: string, dto: UpdateAssetDto) {
    return await this.prisma.assets.update({
      where: {
        id: id,
      },
      data: dto,
    });
  }

  async delete(id: string) {
    return await this.prisma.assets.delete({
      where: {
        id,
      },
    });
  }
}
