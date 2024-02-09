"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = exports.errorResponse = void 0;
const errorResponse = (res, statusCode = 500, message = "Internal Server Error", data) => {
    return res?.status(statusCode).send({
        success: false,
        message,
        data,
    });
};
exports.errorResponse = errorResponse;
const successResponse = (res, statusCode = 200, message = "success", data) => {
    return res?.status(statusCode).send({
        success: true,
        message,
        data,
    });
};
exports.successResponse = successResponse;
