import { Request, Response, NextFunction } from 'express';
import { RateLimiter } from '../lib/rate-limit';
import { constants } from '../config/constants';

const limiter = new RateLimiter({
  windowMs: constants.RATE_LIMIT.WINDOW_MS,
  maxRequests: constants.RATE_LIMIT.MAX_REQUESTS
});

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await limiter.limit(req);
    next();
  } catch (error) {
    if (error instanceof Response) {
      res.status(429).json({
        error: 'Demasiadas solicitudes',
        retryAfter: error.headers.get('Retry-After')
      });
    } else {
      next(error);
    }
  }
};