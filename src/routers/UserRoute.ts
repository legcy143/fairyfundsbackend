import Router from 'express';
import { ChangePassword, EditProfile, FetchProfile, MarkAllSeenNotification, RateUs, RemoveAllNotification, SendOtpToEmail, UpdateEmail, UserLogin, UserSignup } from '../controller/UserController';
import { verifyToken } from '../middlewares/VerifyToken';


const UserRoute = Router();

// user login signup route
UserRoute.post("/login", UserLogin)
UserRoute.post("/signup", UserSignup)
UserRoute.post("/fetchuser", verifyToken, FetchProfile)

// handle notification
UserRoute.post("/notification/seenall", verifyToken, MarkAllSeenNotification)
UserRoute.post("/notification/removeall", verifyToken, RemoveAllNotification)

// get otp to email
UserRoute.post("/otp/getotp", verifyToken, SendOtpToEmail)

// update profile
UserRoute.post("/otp/updateemail", verifyToken, UpdateEmail)
UserRoute.post("/editprofile", verifyToken, EditProfile)
UserRoute.post("/changepassword", verifyToken , ChangePassword)


// extras like rating and fedbacks
UserRoute.post("/rateus", verifyToken , RateUs)


export default UserRoute