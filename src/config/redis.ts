import Redis from 'ioredis';
import { logger } from '../utils/logger';

class RedisClient {
  private static instance: Redis;

  private constructor() {}

  public static getInstance(): Redis {
    if (!RedisClient.instance) {
      const redisUrl = process.env.REDIS_URL;
      if (!redisUrl) {
        throw new Error('REDIS_URL is not defined');
      }
      RedisClient.instance = new Redis(redisUrl, {
        retryStrategy: (times) => Math.min(times * 50, 2000)
      });

      RedisClient.instance.on('error', (error) => {
        logger.error('Redis Error:', error);
      });
    }
    return RedisClient.instance;
  }
}

export const redis = RedisClient.getInstance(); 