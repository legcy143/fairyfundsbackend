import { Request, Response } from "express";
import User from "../Schema/User";
import { GenrateJwtToken } from "../misc/jwt";


export const UserSignup = async (req: Request, res: Response) => {
    try {
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
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const UserLogin = async (req: Request, res: Response) => {
    try {
        const { userName, password } = req.body
        let user;
        user = await User.findOne({ userName, password })
        if (user) {
            let jwt = GenrateJwtToken({ _id: user._id } , '24h')
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
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        })
    }
};


export const FetchProfile = async (req: Request, res: Response) => {
    try {
        let user;
        user = await User.findOne({ _id: req.body.userID })
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
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        })
    }
}