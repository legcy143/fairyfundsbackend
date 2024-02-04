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
const Group_1 = __importDefault(require("./Schema/Group"));
const UserRoleEnum_1 = __importDefault(require("./enums/UserRoleEnum"));
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
    // let arr:any = {a:34};   // run error part
    // arr.map((e:any)=>{console.log(e)})
    return (0, Response_1.successResponse)(res, 200, "OK");
});
// Route with a function containing try-catch block
app.get("/health", healthHandler);
app.get("/test", (0, asyncHandler_1.default)(async (req, res) => {
    const { groupID, userID } = req.body;
    let group;
    group = await Group_1.default.findOneAndUpdate({
        _id: groupID,
        "users.role": UserRoleEnum_1.default.Admin,
        "users.memberID": userID,
    }, {
        funds: 45,
    }, { new: true }).populate({
        path: 'users.memberID',
        select: 'userName',
    });
    return (0, Response_1.successResponse)(res, 200, undefined, group);
}));
app.use("/api/v1/user", UserRoute_1.default);
app.use("/api/v1/group", GroupRoute_1.default);
app.get("*", (0, asyncHandler_1.default)(async (req, res) => {
    return (0, Response_1.errorResponse)(res, 404, "Not Found");
}));
exports.default = app;
