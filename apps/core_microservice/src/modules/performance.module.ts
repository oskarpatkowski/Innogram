import { Module } from '@nestjs/common';
import { PerformanceController } from '../controllers/performance.controller';
import { PerformanceService } from '../services/performance.service';
import { RedisModule } from './redis.module';

@Module({
  imports: [RedisModule],
  controllers: [PerformanceController],
  providers: [PerformanceService],
  exports: [PerformanceService],
})
export class PerformanceModule {}
