import { RutValidator } from '../utils/rutValidator';
import { body } from 'express-validator';

export const authValidation = {
  register: [
    body('firstName').trim().notEmpty().withMessage('El nombre es requerido'),
    body('lastName').trim().notEmpty().withMessage('El apellido es requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('rut')
      .notEmpty().withMessage('El RUT es obligatorio')
      .custom((value) => {
        if (!RutValidator.validate(value)) {
          throw new Error('RUT inválido');
        }
        return true;
      })
      .customSanitizer((value) => {
        return RutValidator.format(value);
      }),
    body('phone').notEmpty().withMessage('Teléfono es requerido')
  ],
  login: [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Contraseña es requerida')
  ],
  verifyEmail: [
    body('email').isEmail().withMessage('Email inválido'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Código inválido')
  ]
};
