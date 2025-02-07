import { redis } from '../config/redis';
import { logger } from '../utils/logger';

export class Cache<T> {
  constructor(private prefix: string, private ttl: number) {}

  async set(key: string, value: T): Promise<void> {
    try {
      const fullKey = `${this.prefix}:${key}`;
      await redis.setex(fullKey, this.ttl / 1000, JSON.stringify(value));
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  }

  async get(key: string): Promise<T | null> {
    try {
      const fullKey = `${this.prefix}:${key}`;
      const data = await redis.get(fullKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const fullKey = `${this.prefix}:${key}`;
      await redis.del(fullKey);
    } catch (error) {
      logger.error('Cache delete error:', error);
    }
  }
}