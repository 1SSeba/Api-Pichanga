"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const express_validator_1 = require("express-validator");
exports.userValidation = {
    updateProfile: [
        (0, express_validator_1.body)('firstName').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
        (0, express_validator_1.body)('lastName').optional().trim().notEmpty().withMessage('El apellido no puede estar vacío'),
        (0, express_validator_1.body)('phone').optional().trim().notEmpty().withMessage('El teléfono no puede estar vacío')
    ]
};
