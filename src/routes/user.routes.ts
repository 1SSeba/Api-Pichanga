import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { userValidation } from '../validations/user.validation';

const router = Router();
const userController = new UserController();

router.get('/profile',
  authMiddleware,
  userController.getProfile
);

router.put('/profile',
  authMiddleware,
  validate(userValidation.updateProfile),
  userController.updateProfile
);

export default router;