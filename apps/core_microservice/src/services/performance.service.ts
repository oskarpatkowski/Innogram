import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class PerformanceService {
  private readonly logger = new Logger(PerformanceService.name);
  private readonly appStartTime = Date.now();
  private readonly REDIS_PREFIX = 'perf_metrics:';

  constructor(private readonly redisService: RedisService) {}

  async recordRequest(method: string, url: string, duration: number) {
    try {
      const client = this.redisService.getClient();
      const basePath = this.normalizeUrl(url);
      const routeKey = `${this.REDIS_PREFIX}route:${method}:${basePath}`;
      const globalKey = `${this.REDIS_PREFIX}global`;

      const multi = client.multi();

      multi.incr(`${globalKey}:total_requests`);

      multi.hincrby(routeKey, 'count', 1);
      multi.hincrby(routeKey, 'totalDuration', duration);

      await multi.exec();

      const currentStats = await client.hgetall(routeKey);
      const currentMax = parseInt(currentStats.maxDuration || '0', 10);
      const currentMin = parseInt(currentStats.minDuration || '999999', 10);

      const updates: Record<string, string | number> = {};
      if (duration > currentMax) {
        updates.maxDuration = duration;
      }
      if (duration < currentMin || currentMin === 999999) {
        updates.minDuration = duration;
      }

      if (Object.keys(updates).length > 0) {
        await client.hset(routeKey, updates);
      }
    } catch (error) {
      this.logger.error('Failed to record performance metrics to Redis', error);
    }
  }

  async getMetrics() {
    try {
      const client = this.redisService.getClient();
      const globalKey = `${this.REDIS_PREFIX}global`;

      const totalRequestsStr = await client.get(`${globalKey}:total_requests`);
      const totalRequests = parseInt(totalRequestsStr || '0', 10);

      const uptime = Date.now() - this.appStartTime;
      const formattedMetrics: Record<string, any> = {};

      const keys = await client.keys(`${this.REDIS_PREFIX}route:*`);

      for (const key of keys) {
        const route = key
          .replace(`${this.REDIS_PREFIX}route:`, '')
          .replace(':', ' ');
        const data = await client.hgetall(key);

        const count = parseInt(data.count || '0', 10);
        const totalDuration = parseInt(data.totalDuration || '0', 10);

        formattedMetrics[route] = {
          totalRequests: count,
          averageDurationMs: count > 0 ? Math.round(totalDuration / count) : 0,
          maxDurationMs: parseInt(data.maxDuration || '0', 10),
          minDurationMs: parseInt(data.minDuration || '0', 10),
        };
      }

      return {
        uptimeSeconds: Math.round(uptime / 1000),
        totalRequestsServed: totalRequests,
        requestsPerMinute: Number(
          ((totalRequests / uptime) * 60000).toFixed(2),
        ),
        routes: formattedMetrics,
      };
    } catch (error) {
      this.logger.error(
        'Failed to fetch performance metrics from Redis',
        error,
      );
      return { error: 'Failed to retrieve metrics' };
    }
  }

  private normalizeUrl(url: string): string {
    return url.replace(/\/[a-f0-9-]{10,}/g, '/:id').replace(/\/\d+/g, '/:id');
  }
}
