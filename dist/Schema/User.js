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
const mongoose_1 = __importStar(require("mongoose"));
const GenderEnum_1 = __importDefault(require("../enums/GenderEnum"));
const UserSchema = new mongoose_1.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        select: false,
        type: String,
        required: true,
    },
    logo: {
        type: String,
        default: "",
    },
    gender: {
        type: String,
        default: GenderEnum_1.default.Other,
    },
    creditScore: {
        type: Number,
        default: 100,
    },
    lastVisit: {
        select: false,
        type: Date,
        default: new Date(),
    }
});
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;