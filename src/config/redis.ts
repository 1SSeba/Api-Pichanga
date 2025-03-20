import Redis from 'ioredis';
import { logger } from '../utils/logger';
import MockRedis from './mock-redis';

class RedisClient {
  private static instance: Redis | MockRedis;

  private constructor() {}

  public static getInstance(): Redis | MockRedis {
    if (!RedisClient.instance) {
      // Verificar si estamos en modo debug
      const isDebugMode = process.env.DEBUG_MODE === 'true';
      
      if (isDebugMode) {
        logger.info('🛠️ Ejecutando en modo DEBUG: Redis no es necesario');
        RedisClient.instance = new MockRedis() as any;
      } else {
        const redisUrl = process.env.REDIS_URL;
        if (!redisUrl) {
          throw new Error('REDIS_URL no está definido. Si deseas ejecutar sin Redis, establece DEBUG_MODE=true');
        }
        
        try {
          RedisClient.instance = new Redis(redisUrl, {
            retryStrategy: (times) => Math.min(times * 50, 2000)
          });

          RedisClient.instance.on('error', (error) => {
            logger.error('Error de Redis:', error);
            logger.info('💡 Consejo: Para ejecutar sin Redis, establece DEBUG_MODE=true en .env');
          });
          
          logger.info('📌 Conectado a Redis');
        } catch (error) {
          logger.error('Error al conectar con Redis:', error);
          logger.info('⚠️ Cambiando automáticamente a modo DEBUG por error de conexión Redis');
          RedisClient.instance = new MockRedis() as any;
        }
      }
    }
    return RedisClient.instance;
  }
}

export const redis = RedisClient.getInstance();