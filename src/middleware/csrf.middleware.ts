import { Request, Response, NextFunction } from 'express';
import { CSRFProtection } from '../lib/csrf';
import { ApiError } from './error.middleware';
import { logger } from '../utils/logger';

export const csrfProtection = async (req: Request, res: Response, next: NextFunction) => {
  // Omitir verificación CSRF en modo debug si SKIP_CSRF=true
  if (process.env.DEBUG_MODE === 'true' && process.env.SKIP_CSRF === 'true') {
    logger.debug('⚠️ Protección CSRF deshabilitada en modo DEBUG');
    return next();
  }

  try {
    // Omitir verificación para métodos seguros
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    const sessionId = req.cookies.session_id;
    const token = req.headers['x-csrf-token'] as string;

    if (!sessionId || !token) {
      throw new ApiError(403, 'Token CSRF faltante');
    }

    const isValid = await CSRFProtection.validateToken(sessionId, token);
    if (!isValid) {
      throw new ApiError(403, 'Token CSRF inválido');
    }

    next();
  } catch (error) {
    next(error);
  }
};