// redis-cooldown.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { RedisCooldownService } from './rediscooldown.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const client = createClient({
          url: `redis://${configService.get('REDIS_HOST', 'localhost')}:${configService.get('REDIS_PORT', 6379)}`,
          password: configService.get('REDIS_PASSWORD', ''),
          database: configService.get('REDIS_DB', 0),
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
    RedisCooldownService,
  ],
  exports: [RedisCooldownService],
})
export class RedisCooldownModule {}
