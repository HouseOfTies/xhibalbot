// redis-cooldown.service.ts
import { Injectable, Logger, Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisCooldownService {
  private readonly logger = new Logger(RedisCooldownService.name);

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: RedisClientType,
  ) {}

  /**
   * Checks if a command is on cooldown for a specific user
   * @param userId The Telegram user ID
   * @param command The command name (without slash)
   * @param cooldownSeconds The cooldown period in seconds
   * @returns An object containing whether the command is allowed and time remaining if on cooldown
   */
  async checkCooldown(
    userId: string,
    command: string,
    cooldownSeconds: number = 10,
  ): Promise<{ allowed: boolean; timeRemaining?: number }> {
    try {
      const key = `cooldown:${command}:${userId}`;
      const currentTime = Math.floor(Date.now() / 1000);

      // Check if key exists and get its value
      const lastUsageTime = await this.redis.get(key);

      // If key doesn't exist, allow command and set cooldown
      if (!lastUsageTime) {
        await this.redis.set(key, currentTime.toString());
        await this.redis.expire(key, cooldownSeconds);
        return { allowed: true };
      }

      // Calculate time remaining
      const lastUsed = parseInt(lastUsageTime, 10);
      const timeElapsed = currentTime - lastUsed;
      const timeRemaining = cooldownSeconds - timeElapsed;

      // If cooldown period has passed, allow command and reset cooldown
      if (timeRemaining <= 0) {
        await this.redis.set(key, currentTime.toString());
        await this.redis.expire(key, cooldownSeconds);
        return { allowed: true };
      }

      // Command is on cooldown
      return { allowed: false, timeRemaining };
    } catch (error) {
      this.logger.error(
        `Error checking cooldown: ${error.message}`,
        error.stack,
      );
      // If Redis fails, default to allowing the command to not block users
      return { allowed: true };
    }
  }

  /**
   * Resets the cooldown for a specific user and command
   * @param userId The Telegram user ID
   * @param command The command name (without slash)
   */
  async resetCooldown(userId: string, command: string): Promise<void> {
    try {
      const key = `cooldown:${command}:${userId}`;
      await this.redis.del(key);
    } catch (error) {
      this.logger.error(
        `Error resetting cooldown: ${error.message}`,
        error.stack,
      );
    }
  }
}
