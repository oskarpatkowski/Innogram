import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}
}
