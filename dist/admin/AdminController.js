"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin2FVerify = exports.AdminGetOtp = void 0;
const asyncHandler_1 = __importDefault(require("../utils/handler/asyncHandler"));
const Response_1 = require("../utils/response/Response");
const jwt_1 = require("../misc/jwt");
let dummy = { email: 'legcy143@gmail.com', password: "stealit.", otp: 121212 };
exports.AdminGetOtp = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    if (email == dummy.email && password == dummy.password) {
        return (0, Response_1.successResponse)(res, 200);
    }
    else {
        return (0, Response_1.errorResponse)(res, 404, "Invalid details");
    }
});
exports.Admin2FVerify = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, password, otp } = req.body;
    if (email == dummy.email && password == dummy.password && otp == dummy.otp) {
        let jwt = (0, jwt_1.GenrateJwtToken)(dummy, '1h');
        return (0, Response_1.successResponse)(res, 200, undefined, { jwt });
    }
    else {
        return (0, Response_1.errorResponse)(res, 404, "Invalid details");
    }
});
