"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenrateJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const GenrateJwtToken = (userPayload, expiresIn = '1h') => {
    const secretKey = process.env.JWT_SECRET || "lb321";
    const token = jsonwebtoken_1.default.sign(userPayload, secretKey, { expiresIn });
    return token;
};
exports.GenrateJwtToken = GenrateJwtToken;
