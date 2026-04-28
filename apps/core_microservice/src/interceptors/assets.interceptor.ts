import { Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, multerConfig } from '../configs/mutler.config';

@Injectable()
export class FileUploadInterceptor extends FileInterceptor('file', {
  storage: multerConfig.storage,
  fileFilter: fileFilter,
}) {}
