"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const DB_1 = __importDefault(require("./config/DB"));
const UserRoute_1 = __importDefault(require("./routers/UserRoute"));
const GroupRoute_1 = __importDefault(require("./routers/GroupRoute"));
const asyncHandler_1 = __importDefault(require("./utils/handler/asyncHandler"));
const Response_1 = require("./utils/response/Response");
const AdminRoute_1 = __importDefault(require("./routers/AdminRoute"));
const SendMail_1 = require("./helper/SendMail");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
}));
(0, DB_1.default)();
app.get("/", (req, res) => {
    return res.status(200).json({
        status: true,
        message: "Hello gyus"
    });
});
let healthHandler = (0, asyncHandler_1.default)(async (req, res, next) => {
    return (0, Response_1.successResponse)(res, 200, "OK", { version: 1 });
});
// Route with a function containing try-catch block
app.get("/health", healthHandler);
app.get("/test", (0, asyncHandler_1.default)(async (req, res) => {
    let boiler = () => {
        return "<h1>every thing is ok</h1>";
    };
    let email = "legcy143@gmail.com";
    let resp = await (0, SendMail_1.SendMail)(email, undefined, boiler);
    console.log("response ", resp);
    return (0, Response_1.successResponse)(res, 200, undefined);
}));
app.use(`/api/v1/user`, UserRoute_1.default);
app.use(`/api/v1/group`, GroupRoute_1.default);
app.use(`/api/v1/admin`, AdminRoute_1.default);
app.get("*", (0, asyncHandler_1.default)(async (req, res) => {
    return (0, Response_1.errorResponse)(res, 404, "Route Not Found , Invalid Route");
}));
app.post("*", (0, asyncHandler_1.default)(async (req, res) => {
    return (0, Response_1.errorResponse)(res, 404, "Route Not Found , Invalid Route");
}));
exports.default = app;
