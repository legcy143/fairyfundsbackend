import mongoose, { Mongoose, Schema } from "mongoose";
import { UserTypes } from "../types/UserTypes";
import GenderEnum from "../enums/GenderEnum";

const UserSchema: Schema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
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
    creditScore: {
        type: Number,
        default: 100,
    },
    lastVisit: {
        select: false,
        type: Date,
        default: new Date(),
    }
})

const User = mongoose.model<UserTypes>("User", UserSchema);
export default User;