import { Request, Response } from "express";
import User from "../Schema/User";
import { GenrateJwtToken } from "../misc/jwt";
import asyncHandler from "../utils/handler/asyncHandler";
import { errorResponse, successResponse } from "../utils/response/Response";
import { SendMail } from "../helper/SendMail";
import UpdateEmailOtpTemplate from "../templates/email/UpdateEmailOtpTemplate";
import Otp from "../Schema/Otp";
import { OtpGenerator, VerificationCodeGenerator } from "../utils/generator/OtpUtils";


export const UserSignup = asyncHandler(async (req: Request, res: Response) => {
        const { userName, password } = req.body
        let user;
        user = await User.findOne({ userName })
        if (user) {
            return res.status(400).send({
                success: false,
                message: `User with Username ${userName} is taken`,
            })
        }
        user = await User.create({
            userName, password
        })
        let jwt = GenrateJwtToken({ _id: user._id })
        return res.status(200).send({
            success: true,
            user,
            jwt,
        })
})

export const UserLogin = asyncHandler(async (req: Request, res: Response) => {
        const { userName, password } = req.body;
        let user;
        user = await User.findOne({ userName, password })
        if (user) {
            let jwt = GenrateJwtToken({ _id: user._id }, '24h')
            return res.status(200).send({
                success: true,
                user,
                jwt
            })
        }
        return errorResponse(res , 404 , "Wrong credential")
});


export const FetchProfile = asyncHandler(async (req: Request, res: Response) => {
        let user;
        user = await User.findOneAndUpdate({ _id: req.body.userID } , 
            {lastVisit: new Date() },
            {new :true})
        if (user) {
            // let jwt = GenrateJwtToken({ _id: user._id })
            return res.status(200).send({
                success: true,
                user,
            })
        }
        return res.status(404).send({
            success: false,
            message: "User Not Found"
        })
})


type UpdateUserData = {
    name: string;
    userName: string;
    bio: string;
    myLocation: string;
    phoneNumber: string;
    email: string;
    isPrivate: boolean,
    gender: "male" | "female" | "other";
};

export const EditProfile = asyncHandler(async (req: Request, res: Response) => {
    const { name, userName, bio, myLocation, gender ,isPrivate }: UpdateUserData = req.body;
        let user;
        // user = await User.findOne({ _id: req.body.userID })
        user = await User.findByIdAndUpdate(
            { _id: req.body.userID },
            { name, userName, bio, myLocation, gender,isPrivate },
            { new: true }
        )
        if (user) {
            return res.status(200).send({
                success: true,
                user,
            })
        }
        return errorResponse(res , 404 , "User Not Found")
})

export const MarkAllSeenNotification = asyncHandler(async(req:Request , res:Response)=>{
    const {userID} = req.body;
    // console.log("hii " , userID)
    let user = await User.findOneAndUpdate(
        {_id:userID},
        {
            $set:{
                'notifications.$[].isSeen':true,
            }
        },
        {new:true}
    )
    if(user){
        return successResponse(res , 200 , "notification is marked as seen succesfully" , user)
    }
    return errorResponse(res,404,"Notification not found")
})

export const RemoveAllNotification = asyncHandler(async(req:Request , res:Response)=>{
    const {userID} = req.body;
    
    let user = await User.findOneAndUpdate(
        {_id:userID},
        {
            $set:{
                notifications:[]
            }
        },
        {new:true}
    )
    if(user){
        return successResponse(res , 200 , "Remove all notificaion successfully" , user)
    }
    return errorResponse(res,404,"Notification not found")
})

export const SendOtpToEmail = asyncHandler(async(req:Request , res:Response)=>{
    const {email , otpGeneratorDetail , userID} = req.body;
    let detail = {...otpGeneratorDetail , genBy:userID}
    detail = JSON.stringify(otpGeneratorDetail)
    let newOtpCode = OtpGenerator();
    let VerificationCode = VerificationCodeGenerator() 
    // console.log(email , otpGeneratorDetail)
    let resp = await SendMail(email ,"Update email otp" , UpdateEmailOtpTemplate(newOtpCode , new Date().toLocaleString()));
    // return successResponse(res ,) 
    if(resp == -1){
        return errorResponse(res , 500)
    }
    let otpRes = await Otp.findOneAndUpdate(
            {email},
            {
                otp:newOtpCode,
                isValid:true,
                VerificationCode,
                otpGeneratorDetail:detail
            },
            {new:true})

    if(!otpRes){
        otpRes = await Otp.create({
            email,
            otp:newOtpCode,
            VerificationCode,
            otpGeneratorDetail
        })
    }

    return successResponse(res , undefined , "otp send succesfully")

});


export const UpdateEmail = asyncHandler(async(req:Request , res:Response)=>{
    const {email , otp , userID} = req.body;
    let otpRes = await Otp.findOneAndUpdate({email , otp},{
        isValid:false,
    })
    let VerificationCode = VerificationCodeGenerator()
    if(otpRes && VerificationCode - otpRes.VerificationCode <= 600 && otp == otpRes.otp && otpRes.isValid){
        let data:any = JSON.stringify({visit:"profile"})
            let user = await User.findOneAndUpdate({_id:userID},
                {
                    email,
                    $push: {
                        notifications: {
                            $each: [{
                                title: "Email update",
                                message: `your email was update , see your profile for more detail`,
                            }],
                            $position: 0,
                        }
                    }
                },
                {new:true})
                ;
                if(user){
                    return successResponse(res , 200 , "update email successfully"  , user)
                }
    }
    return errorResponse(res ,404 , "Invalid otp")

})

export const ChangePassword = asyncHandler(async(req:Request , res:Response)=>{
    const {OldPassword , NewPassword , userID} = req.body;
   let user = await User.findById({_id:userID}).select("password");
   console.log(user)
    if(user && OldPassword == user?.password){
            let user = await User.findOneAndUpdate({_id:userID},
                {
                    password:NewPassword,
                    $push: {
                        notifications: {
                            $each: [{
                                title: "Password Change",
                                message: `your Password was change , see your profile for more detail`,
                            }],
                            $position: 0,
                        }
                    }
                },
                {new:true});
                if(user){
                    return successResponse(res , 200 , "change password successfully" )
                }
    }
    return errorResponse(res ,404 , "old password is incorrect")

})
export const RateUs = asyncHandler(async(req:Request , res:Response)=>{
    const {star , message , userID} = req.body;
            let user = await User.findOneAndUpdate({_id:userID},
                {
                    rating:{
                        star,
                        message,
                    },
                    $push: {
                        notifications: {
                            $each: [{
                                title: "Thank You",
                                message: `Thank you for you rating we love to hear it from you`,
                            }],
                            $position: 0,
                        }
                    }
                },
                {new:true});
                if(user){
                    return successResponse(res , 200 , "rating recorded thatnk you for this" , user)
                }
    return errorResponse(res ,404 , "something went wrong")

})

// export const SendFeedBack = asyncHandler(async (req: Request, res: Response) => {
    
// })