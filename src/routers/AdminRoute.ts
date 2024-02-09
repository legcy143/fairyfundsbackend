import { Router } from "express";
import { verifyToken } from "../middlewares/VerifyToken";
import { Admin2FVerify, AdminGetOtp } from "../admin/AdminController";

const AdminRoute = Router();

AdminRoute.post("/getotp" , AdminGetOtp)
AdminRoute.post("/verify2f" , Admin2FVerify)

export default AdminRoute;