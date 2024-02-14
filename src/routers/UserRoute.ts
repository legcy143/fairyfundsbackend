import Router from 'express';
import { EditProfile, FetchProfile, MarkAllSeenNotification, RemoveAllNotification, UserLogin, UserSignup } from '../controller/UserController';
import { verifyToken } from '../middlewares/VerifyToken';


const UserRoute = Router();

// user login signup route
UserRoute.post("/login", UserLogin)
UserRoute.post("/signup", UserSignup)
UserRoute.post("/fetchuser", verifyToken, FetchProfile)
UserRoute.post("/editprofile", verifyToken, EditProfile)
UserRoute.post("/notification/seenall", verifyToken, MarkAllSeenNotification)
UserRoute.post("/notification/removeall", verifyToken, RemoveAllNotification)


export default UserRoute