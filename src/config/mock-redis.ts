
import { logger } from '../utils/logger';

class MockRedis {
  private storage: Map<string, { value: string; expiry: number | null }>;

  constructor() {
    this.storage = new Map();
    logger.info('🔧 Modo DEBUG: Redis simulado en memoria activado');
  }

  async get(key: string): Promise<string | null> {
    const item = this.storage.get(key);
    
    if (!item) return null;
    
    // Verificar si el item ha expirado
    if (item.expiry !== null && item.expiry < Date.now()) {
      this.storage.delete(key);
      return null;
    }
    
    return item.value;
  }

  async set(key: string, value: string): Promise<'OK'> {
    this.storage.set(key, { value, expiry: null });
    return 'OK';
  }

  async setex(key: string, seconds: number, value: string): Promise<'OK'> {
    const expiryTime = Date.now() + (seconds * 1000);
    this.storage.set(key, { value, expiry: expiryTime });
    return 'OK';
  }

  async del(key: string): Promise<number> {
    const deleted = this.storage.delete(key);
    return deleted ? 1 : 0;
  }

  // Métodos adicionales que podrían necesitarse
  async flushAll(): Promise<'OK'> {
    this.storage.clear();
    return 'OK';
  }

  // Implementación de event emitter para compatibilidad
  on(event: string, callback: (...args: any[]) => void): void {
    // No se hace nada en la versión mock
  }
}

export default MockRedis;