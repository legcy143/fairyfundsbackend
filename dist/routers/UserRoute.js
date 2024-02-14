"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controller/UserController");
const VerifyToken_1 = require("../middlewares/VerifyToken");
const UserRoute = (0, express_1.default)();
// user login signup route
UserRoute.post("/login", UserController_1.UserLogin);
UserRoute.post("/signup", UserController_1.UserSignup);
UserRoute.post("/fetchuser", VerifyToken_1.verifyToken, UserController_1.FetchProfile);
UserRoute.post("/editprofile", VerifyToken_1.verifyToken, UserController_1.EditProfile);
UserRoute.post("/notification/seenall", VerifyToken_1.verifyToken, UserController_1.MarkAllSeenNotification);
UserRoute.post("/notification/removeall", VerifyToken_1.verifyToken, UserController_1.RemoveAllNotification);
exports.default = UserRoute;
