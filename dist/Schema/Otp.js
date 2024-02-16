"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const OtpTypeEnum_1 = __importDefault(require("../enums/OtpTypeEnum"));
exports.OtpSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        default: 0
    },
    VerificationCode: {
        type: Number
    },
    otpFor: {
        type: String,
        default: OtpTypeEnum_1.default.default
    },
    isValid: {
        type: Boolean,
        default: true
    },
    otpGeneratorDetail: {
        type: String,
        default: ""
    },
}, { timestamps: true });
const Otp = mongoose_1.default.model("Otp", exports.OtpSchema);
exports.default = Otp;
