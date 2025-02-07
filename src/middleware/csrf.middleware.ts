
import { Request, Response, NextFunction } from 'express';
import { CSRFProtection } from '../lib/csrf';

export const csrfMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const sessionId = req.cookies && req.cookies['session_id'];
  const token = req.headers['x-csrf-token'] as string;
  
  if (!sessionId || !token) {
    return res.status(403).json({ success: false, error: 'CSRF token missing' });
  }

  const valid = await CSRFProtection.validateToken(sessionId, token);
  if (!valid) {
    return res.status(403).json({ success: false, error: 'CSRF token invalid' });
  }

  next();
};