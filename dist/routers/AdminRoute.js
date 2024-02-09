"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VerifyToken_1 = require("../middlewares/VerifyToken");
const AdminAuth_1 = require("../admin/AdminAuth");
const AdminController_1 = require("../admin/AdminController");
const AdminRoute = (0, express_1.Router)();
// profiling routes
AdminRoute.post("/getotp", AdminAuth_1.AdminGetOtp);
AdminRoute.post("/verify2f", AdminAuth_1.Admin2FVerify);
AdminRoute.post("/fetchprofile", VerifyToken_1.verifyToken, AdminAuth_1.FetchAdminProfile);
// dashboard routes
//users
AdminRoute.get("/users", VerifyToken_1.verifyToken, AdminController_1.FetchAllUser);
AdminRoute.get("/groups", VerifyToken_1.verifyToken, AdminController_1.FetchAllGroup);
exports.default = AdminRoute;
