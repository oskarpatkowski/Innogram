import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        info: {
          database: {
            status: 'up',
          },
        },
        error: {},
        details: {
          database: {
            status: 'up',
          },
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          info: {},
          error: {
            database: {
              status: 'down',
              message: error instanceof Error ? error.message : 'Unknown error',
            },
          },
          details: {
            database: {
              status: 'down',
              message: error instanceof Error ? error.message : 'Unknown error',
            },
          },
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
