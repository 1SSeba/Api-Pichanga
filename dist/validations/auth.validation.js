"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const rutValidator_1 = require("../utils/rutValidator");
const express_validator_1 = require("express-validator");
exports.authValidation = {
    register: [
        (0, express_validator_1.body)('firstName').trim().notEmpty().withMessage('El nombre es requerido'),
        (0, express_validator_1.body)('lastName').trim().notEmpty().withMessage('El apellido es requerido'),
        (0, express_validator_1.body)('email').isEmail().withMessage('Email inválido'),
        (0, express_validator_1.body)('password')
            .isLength({ min: 8 })
            .withMessage('La contraseña debe tener al menos 8 caracteres'),
        (0, express_validator_1.body)('rut')
            .notEmpty().withMessage('El RUT es obligatorio')
            .custom((value) => {
            if (!rutValidator_1.RutValidator.validate(value)) {
                throw new Error('RUT inválido');
            }
            return true;
        })
            .customSanitizer((value) => {
            return rutValidator_1.RutValidator.format(value);
        }),
        (0, express_validator_1.body)('phone').notEmpty().withMessage('Teléfono es requerido')
    ],
    login: [
        (0, express_validator_1.body)('email').isEmail().withMessage('Email inválido'),
        (0, express_validator_1.body)('password').notEmpty().withMessage('Contraseña es requerida')
    ],
    verifyEmail: [
        (0, express_validator_1.body)('email').isEmail().withMessage('Email inválido'),
        (0, express_validator_1.body)('code').isLength({ min: 6, max: 6 }).withMessage('Código inválido')
    ]
};
