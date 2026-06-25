import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PerformanceService } from '../services/performance.service';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Performance');
  private readonly SLOW_REQUEST_THRESHOLD_MS = 500;

  constructor(private readonly performanceService: PerformanceService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    const { method, url } = req;

    if (url === '/performance') {
      return next.handle();
    }

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;

        void this.performanceService.recordRequest(method, url, duration);

        if (duration > this.SLOW_REQUEST_THRESHOLD_MS) {
          this.logger.warn(`Slow Request: ${method} ${url} took ${duration}ms`);
        }
      }),
    );
  }
}
