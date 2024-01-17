"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    let secret = process.env.JWT_SECRET || "lb321";
    const token = req.headers.authorization;
    // console.log(req.body)
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }
    jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
        req.body.userID = decoded._id;
        next();
    });
};
exports.verifyToken = verifyToken;
