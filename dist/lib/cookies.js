"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieManager = void 0;
const constants_1 = require("../config/constants");
class CookieManager {
    static setAuthCookies(res, { token, refreshToken }) {
        res.cookie(constants_1.constants.COOKIE.AUTH, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3 * 60 * 60 * 1000 // 3 hours
        });
        res.cookie(constants_1.constants.COOKIE.REFRESH, refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
    }
    static clearAuthCookies(res) {
        res.clearCookie(constants_1.constants.COOKIE.AUTH);
        res.clearCookie(constants_1.constants.COOKIE.REFRESH);
    }
}
exports.CookieManager = CookieManager;
