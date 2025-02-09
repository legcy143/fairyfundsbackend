import { Request, Response } from "express";
import asyncHandler from "../utils/handler/asyncHandler";
import { errorResponse, successResponse } from "../utils/response/Response";
import { GenrateJwtToken } from "../misc/jwt";

// let dummy = {_id:566556655665,email :'legcy143@gmail.com', password:"stealit." , otp:121212};
let dummy = {
    _id:process.env.ADMIN_ID,
    email : process.env.ADMIN_EMAIL ,
    password:process.env.ADMIN_PASSWORD ,
    otp:process.env.ADMIN_OTP
}

export const AdminGetOtp = asyncHandler(async(req:Request , res:Response)=>{
    const {email , password } = req.body;
    if(email == dummy.email && password == dummy.password){
        return successResponse(res , 200)
    }
    else{
        return errorResponse(res , 404 , "Invalid details")
    }
})

export const Admin2FVerify = asyncHandler(async(req:Request , res:Response)=>{
    const {email , password ,otp } = req.body;
    console.log(" dummy otp " , dummy.otp)
    if(email == dummy.email && password == dummy.password && otp == dummy.otp){
        let jwt = GenrateJwtToken(dummy ,'1h');
        let profile = {
            name:"legcy",
            email,
        }
        return successResponse(res , 200 , undefined , {profile , jwt})
    }
    else{
        return errorResponse(res , 404 , "Invalid details")
    }
})
export const FetchAdminProfile = asyncHandler(async(req:Request , res:Response)=>{
    const {userID} = req.body;
    if(userID == dummy._id){
        let profile = {
            name:"legcy",
            email:dummy.email,
        }
        return successResponse(res , 200 , undefined , profile)
    }
    else{
        return errorResponse(res , 404 , "Invalid details")
    }
})