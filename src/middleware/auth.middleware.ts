import { Request, Response, NextFunction } from 'express';
import { constants } from '../config/constants';
import { JWT } from '../lib/jwt';
import { RutValidator } from '../utils/rutValidator';
import { AuthRequest } from '../interfaces/request.interfaces';
import { UserResponse } from '../types/auth.types';
import { ApiError } from './error.middleware';

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

export const validateRut = (req: Request, res: Response, next: NextFunction) => {
  const { rut } = req.body;
  
  if (!rut) {
    return next(new ApiError(400, 'RUT es requerido'));
  }
  
  if (!RutValidator.validate(rut)) {
    return next(new ApiError(400, 'RUT inválido'));
  }
  
  // Formatea el RUT antes de pasarlo al siguiente middleware
  req.body.rut = RutValidator.format(rut);
  next();
};