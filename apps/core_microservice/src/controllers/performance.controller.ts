import { Controller, Get } from '@nestjs/common';
import { PerformanceService } from '../services/performance.service';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get()
  getPerformanceMetrics() {
    return this.performanceService.getMetrics();
  }
}
