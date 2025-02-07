
import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { userValidation } from '../validations/user.validation';

const router = Router();
const profileController = new ProfileController();

router.get('/profile', authMiddleware, profileController.getProfile);
router.put('/profile', authMiddleware, validate(userValidation.updateProfile), profileController.updateProfile);

export default router;