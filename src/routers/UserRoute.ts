import Router from 'express';
import { FetchProfile, UserLogin, UserSignup } from '../controller/UserController';
import { verifyToken } from '../middlewares/VerifyToken';


const UserRoute = Router();

// user login signup route
UserRoute.post("/login", UserLogin)
UserRoute.post("/signup", UserSignup)
UserRoute.post("/fetchuser", verifyToken , FetchProfile)

// update profile route
// User.put("/update" , verifyToken ,UpdateProfile)

// fetch user profile route
// User.get("/" , verifyToken ,FetchAccount)

export default UserRoute