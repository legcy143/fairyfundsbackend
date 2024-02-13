import mongoose, { Mongoose, Schema } from "mongoose";
import { UserTypes } from "../types/UserTypes";
import GenderEnum from "../enums/GenderEnum";

const UserSchema: Schema<UserTypes> = new Schema<UserTypes>({
    name: {
        type: String,
        default: "user"
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        set: (value:any) => value.toLowerCase(),
    },
    bio: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    myLocation: {
        type: String,
        default: ""
    },
    password: {
        select: false,
        type: String,
        required: true,
    },
    logo: {
        type: String,
        default: "",
    },
    gender: {
        type: String,
        default: GenderEnum.Other,
    },
    isPrivate: {
        type: Boolean,
        default: true,
    },
    isVerifyed: {
        type: Boolean,
        default: false,
    },
    creditScore: {
        type: Number,
        default: 100,
    },
    notification_token:{
        type:String,
        default:"",
    },
    notifications:[
        {
            message:{
                type:String,
            },
            title:{
                type:String,
            },
            data:{
                type:String,
            },
            createdAt:{
                type:Date,
                default : new Date(),
            }
        }
    ],
    lastVisit: {
        select: false,
        type: Date,
        default: new Date(),
    },
} ,{timestamps:true})

const User = mongoose.model<UserTypes>("User", UserSchema);
export default User;