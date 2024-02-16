"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = exports.NODEMAILER_CONFIG = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.NODEMAILER_CONFIG = {
    service: 'Gmail',
    auth: {
        user: process.env.NODEMAILER_CONFIG_EMAIL,
        pass: process.env.NODEMAILER_CONFIG_EMAIL_PASSWORD // Replace with the generated app password
    }
};
// console.log("nodemialer config " , NODEMAILER_CONFIG)
exports.transporter = nodemailer_1.default.createTransport(exports.NODEMAILER_CONFIG);
