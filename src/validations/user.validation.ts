
import { body } from 'express-validator';

export const userValidation = {
  updateProfile: [
    body('firstName').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
    body('lastName').optional().trim().notEmpty().withMessage('El apellido no puede estar vacío'),
    body('phone').optional().trim().notEmpty().withMessage('El teléfono no puede estar vacío')
  ]
};