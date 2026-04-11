import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateAssetDto } from '../../dto/create.asset.dto';
import { UpdateAssetDto } from '../../dto/update.asset.dto';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAssetDto) {
    const asset = await this.prisma.assets.create({
      data: dto,
    });
    Logger.log(`Asset ${asset.id} created`, 'AssetsService');
    return asset;
  }

  async getById(id: string) {
    const asset = await this.prisma.assets.findUnique({
      where: {
        id,
      },
    });

    if (asset) {
      Logger.log(`Asset ${asset.id} found`, 'AssetsService');
    } else {
      Logger.log(`Asset ${id} not found`, 'AssetsService');
    }

    return asset;
  }

  async getAll() {
    const assets = await this.prisma.assets.findMany();

    if (assets.length > 0) {
      Logger.log(`Found ${assets.length} assets`, 'AssetsService');
    } else {
      Logger.log(`No assets found`, 'AssetsService');
    }

    return assets;
  }

  async update(id: string, dto: UpdateAssetDto) {
    const asset = await this.prisma.assets.update({
      where: {
        id: id,
      },
      data: dto,
    });

    Logger.log(`Asset ${asset.id} updated`, 'AssetsService');

    return asset;
  }

  async delete(id: string) {
    const asset = await this.prisma.assets.delete({
      where: {
        id,
      },
    });

    if (asset) {
      Logger.log(`Asset ${asset.id} deleted`, 'AssetsService');
    } else {
      Logger.log(`Asset ${id} not found`, 'AssetsService');
    }

    return asset;
  }
}
