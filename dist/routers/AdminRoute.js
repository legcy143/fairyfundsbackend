"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminAuth_1 = require("../admin/AdminAuth");
const AdminController_1 = require("../admin/AdminController");
const AdminCheck_1 = require("../admin/AdminCheck");
const AdminRoute = (0, express_1.Router)();
// profiling routes
AdminRoute.post("/getotp", AdminAuth_1.AdminGetOtp);
AdminRoute.post("/verify2f", AdminAuth_1.Admin2FVerify);
AdminRoute.post("/fetchprofile", AdminCheck_1.AdminCheck, AdminAuth_1.FetchAdminProfile);
// dashboard routes
//users
AdminRoute.get("/users", AdminCheck_1.AdminCheck, AdminController_1.FetchAllUser);
AdminRoute.get("/groups", AdminCheck_1.AdminCheck, AdminController_1.FetchAllGroup);
exports.default = AdminRoute;
