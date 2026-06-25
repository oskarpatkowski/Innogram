import { Module, Global } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import KeyvRedis from '@keyv/redis';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST') || 'localhost';
        const port = configService.get<number>('REDIS_PORT') || 6379;
        const username = configService.get<string>('REDIS_USERNAME') || '';
        const password = configService.get<string>('REDIS_PASSWORD') || '';
        const db = configService.get<number>('REDIS_DB') || 0;

        let url = 'redis://';
        if (username || password) {
          url += `${username}:${password}@`;
        }
        url += `${host}:${port}/${db}`;

        return {
          stores: [new KeyvRedis(url)],
        };
      },
    }),
  ],
  exports: [NestCacheModule],
})
export class CustomCacheModule {}
