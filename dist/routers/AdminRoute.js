"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminController_1 = require("../admin/AdminController");
const AdminRoute = (0, express_1.Router)();
AdminRoute.post("/getotp", AdminController_1.AdminGetOtp);
AdminRoute.post("/verify2f", AdminController_1.Admin2FVerify);
exports.default = AdminRoute;
