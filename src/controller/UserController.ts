import { Request, Response } from "express";
import User from "../Schema/User";
import { GenrateJwtToken } from "../misc/jwt";
import asyncHandler from "../utils/handler/asyncHandler";
import { errorResponse } from "../utils/response/Response";


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
        return res.status(404).send({
            success: false,
            message: "User Not Found"
        })
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
    const { name, userName, bio, myLocation, phoneNumber, email, gender ,isPrivate }: UpdateUserData = req.body;
        let user;
        // user = await User.findOne({ _id: req.body.userID })
        user = await User.findByIdAndUpdate(
            { _id: req.body.userID },
            { name, userName, bio, myLocation, phoneNumber, email, gender,isPrivate, updatedAt: new Date() },
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

// export const SendFeedBack = asyncHandler(async (req: Request, res: Response) => {
    
// })