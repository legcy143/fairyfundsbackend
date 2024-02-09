import { Request, Response } from "express";
import asyncHandler from "../utils/handler/asyncHandler";
import { errorResponse, successResponse } from "../utils/response/Response";
import { GenrateJwtToken } from "../misc/jwt";

let dummy = {email :'legcy143@gmail.com', password:"stealit." , otp:121212};

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
    if(email == dummy.email && password == dummy.password && otp == dummy.otp){
        let jwt = GenrateJwtToken(dummy ,'1h');
        return successResponse(res , 200 , undefined , {jwt})
    }
    else{
        return errorResponse(res , 404 , "Invalid details")
    }
})