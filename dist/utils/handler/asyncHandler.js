"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Response_1 = require("../response/Response");
function asyncHandler(innerFunc) {
    return async (req, res, next) => {
        try {
            await innerFunc(req, res, next);
        }
        catch (error) {
            return (0, Response_1.errorResponse)(res);
        }
    };
}
exports.default = asyncHandler;
;
