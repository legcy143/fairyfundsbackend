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
        message: "Hello gyus"
    });
});
app.use("/api/v1/user", UserRoute_1.default);
app.use("/api/v1/group", GroupRoute_1.default);
exports.default = app;
