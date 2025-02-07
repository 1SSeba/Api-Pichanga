import { Request, Response, NextFunction } from 'express';
import { constants } from '../config/constants';
import { JWT } from '../lib/jwt';
import { AuthRequest } from '../interfaces/request.interfaces';
import { UserResponse } from '../types/auth.types';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies && req.cookies[constants.COOKIE.AUTH];
  if (!token) {
    return res.status(401).json({ success: false, error: 'No autorizado' });
  }

  try {
    const decoded = JWT.verifyToken(token) as UserResponse;
    if (decoded._id) {
      req.user = {
        _id: decoded._id.toString(),
        email: decoded.email,
        role: decoded.role
      };
    }
    req.user = {
      _id: decoded._id?.toString() || '',
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Token inválido' });
  }
};