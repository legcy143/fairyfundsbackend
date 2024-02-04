"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = exports.errorResponse = void 0;
const errorResponse = (res, statusCode = 500, message = "Internal Server Error", data, isSuccess = false) => {
    return res?.status(statusCode).send({
        success: isSuccess,
        message,
        data
    });
};
exports.errorResponse = errorResponse;
const successResponse = (res, statusCode = 200, message = "success", data, isSuccess = true) => {
    return res?.status(statusCode).send({
        success: isSuccess,
        message,
        data,
    });
};
exports.successResponse = successResponse;
