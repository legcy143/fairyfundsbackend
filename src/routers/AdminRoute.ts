import { Router } from "express";
import { verifyToken } from "../middlewares/VerifyToken";
import { Admin2FVerify, AdminGetOtp, FetchAdminProfile } from "../admin/AdminAuth";
import { FetchAllGroup, FetchAllUser } from "../admin/AdminController";

const AdminRoute = Router();

// profiling routes
AdminRoute.post("/getotp" , AdminGetOtp)
AdminRoute.post("/verify2f" , Admin2FVerify)
AdminRoute.post("/fetchprofile",verifyToken , FetchAdminProfile)

// dashboard routes

//users
AdminRoute.get("/users" , verifyToken , FetchAllUser)
AdminRoute.get("/groups" , verifyToken , FetchAllGroup)


export default AdminRoute;