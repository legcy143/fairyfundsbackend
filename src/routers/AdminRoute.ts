import { Router } from "express";
import { verifyToken } from "../middlewares/VerifyToken";
import { Admin2FVerify, AdminGetOtp, FetchAdminProfile } from "../admin/AdminAuth";
import { FetchAllGroup, FetchAllUser } from "../admin/AdminController";
import { AdminCheck } from "../admin/AdminCheck";

const AdminRoute = Router();

// profiling routes
AdminRoute.post("/getotp" , AdminGetOtp)
AdminRoute.post("/verify2f" , Admin2FVerify)
AdminRoute.post("/fetchprofile",AdminCheck , FetchAdminProfile)

// dashboard routes

//users
AdminRoute.get("/users" , AdminCheck , FetchAllUser)
AdminRoute.get("/groups" , AdminCheck , FetchAllGroup)


export default AdminRoute;