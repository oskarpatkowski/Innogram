import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AssetsService } from '../services/assetes.service';
import { CreateAssetDto } from '../../dto/create.asset.dto';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  async create(@Body() assetDto: CreateAssetDto) {
    return await this.assetsService.create(assetDto);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.assetsService.getById(id);
  }

  @Get()
  async getAll() {
    return await this.assetsService.getAll();
  }

  @Put()
  async update(@Param('id') id: string, @Body() assetDto: CreateAssetDto) {
    return await this.assetsService.update(id, assetDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.assetsService.delete(id);
  }
}
