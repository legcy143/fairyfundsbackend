import Router from 'express';
import { EditProfile, FetchProfile, UserLogin, UserSignup } from '../controller/UserController';
import { verifyToken } from '../middlewares/VerifyToken';


const UserRoute = Router();

// user login signup route
UserRoute.post("/login", UserLogin)
UserRoute.post("/signup", UserSignup)
UserRoute.post("/fetchuser", verifyToken , FetchProfile)
UserRoute.post("/editprofile", verifyToken , EditProfile)


export default UserRoute