"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretKeyConverter = exports.decryption = exports.encryption = void 0;
const crypto_1 = __importDefault(require("crypto"));
function encryption(text, key) {
    try {
        const iv = crypto_1.default.randomBytes(16);
        const cipher = crypto_1.default.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
        let encrypted = cipher.update(text, 'utf-8', 'hex');
        encrypted += cipher.final('hex');
        return { encrypted, iv: iv.toString('hex') };
    }
    catch (e) {
        return -1;
    }
}
exports.encryption = encryption;
function decryption(encryptedText, iv, key) {
    try {
        const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', Buffer.from(key), Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');
        return decrypted;
    }
    catch (e) {
        return -1;
    }
}
exports.decryption = decryption;
function SecretKeyConverter(text) {
    const hash = crypto_1.default.createHash('sha256');
    hash.update(text);
    return hash.digest();
}
exports.SecretKeyConverter = SecretKeyConverter;
