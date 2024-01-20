import { Date } from "mongoose";
import GenderEnum from "../enums/GenderEnum";

export interface UserTypes extends Document {
    name: string;
    userName: string;
    bio: string;
    phoneNumber: string;
    email: string;
    myLocation: string;
    password: string;
    logo: string;
    gender: GenderEnum;
    isPrivate: boolean;
    isVerifyed: boolean;
    creditScore: number;
    lastVisit: Date;
    updatedAt: Date,
    createdAt: Date,
}
