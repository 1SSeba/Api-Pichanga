import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { rateLimitMiddleware } from '../middleware/rate-limit.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { authValidation } from '../validations/auth.validation';

const router = Router();
const authController = new AuthController();

router.post('/register', async (req, res, next) => {
  try {
    await authController.register(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/login',
  rateLimitMiddleware,
  validate(authValidation.login),
  authController.login
);

router.post('/verify-email',
  rateLimitMiddleware,
  validate(authValidation.verifyEmail),
  authController.verifyEmail
);

router.post('/refresh-token',
  rateLimitMiddleware,
  authController.refreshToken
);

router.post('/logout',
  authMiddleware,
  authController.logout
);

export default router;