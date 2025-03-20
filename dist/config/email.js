"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sgMail = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
exports.sgMail = mail_1.default;
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
