"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRut = exports.authMiddleware = void 0;
const constants_1 = require("../config/constants");
const jwt_1 = require("../lib/jwt");
const rutValidator_1 = require("../utils/rutValidator");
const authMiddleware = (req, res, next) => {
    const token = req.cookies && req.cookies[constants_1.constants.COOKIE.AUTH];
    if (!token) {
        return res.status(401).json({ success: false, error: 'No autorizado' });
    }
    try {
        const decoded = jwt_1.JWT.verifyToken(token);
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
    }
    catch (error) {
        res.status(401).json({ success: false, error: 'Token inválido' });
    }
};
exports.authMiddleware = authMiddleware;
const validateRut = (req, res, next) => {
    const { rut } = req.body;
    if (!rut) {
        return next(new ApiError('RUT es requerido', 400));
    }
    if (!rutValidator_1.RutValidator.validate(rut)) {
        return next(new ApiError('RUT inválido', 400));
    }
    // Formatea el RUT antes de pasarlo al siguiente middleware
    req.body.rut = rutValidator_1.RutValidator.format(rut);
    next();
};
exports.validateRut = validateRut;
