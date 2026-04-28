import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import 'multer';
import type { AuthenticatedRequest } from '../guards/access.guard';
import { AccessGuard } from '../guards/access.guard';
import { FileUploadInterceptor } from '../interceptors/assets.interceptor';
import { AssetsService } from '../services/assetes.service';

@Controller('assets')
@UseGuards(AccessGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @UseInterceptors(FileUploadInterceptor)
  async create(
    @UploadedFile()
    file: Express.Multer.File,
    @Req() request: AuthenticatedRequest,
  ) {
    const assetDto = {
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      filePath: `/uploads/${file.filename}`,
      createdById: request.user.userId,
    };
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

  @Get('/post/:postId')
  async getByPostId(@Param('postId') postId: string) {
    return await this.assetsService.getByPostId(postId);
  }

  @Put(':id')
  @UseInterceptors(FileUploadInterceptor)
  async update(
    @Param('id') id: string,
    @UploadedFile()
    file: Express.Multer.File,
    @Req() request: AuthenticatedRequest,
  ) {
    const assetDto = {
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      filePath: `/uploads/${file.filename}`,
      createdById: request.user.userId,
    };
    return await this.assetsService.update(id, assetDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.assetsService.delete(id);
  }
}
