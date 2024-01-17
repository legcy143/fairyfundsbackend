import { Date } from "mongoose";
import GenderEnum from "../enums/GenderEnum";

export interface UserTypes extends Document {
    userName: string;
    password: string;
    logo: string;
    gender: GenderEnum;
    credit: number,
    lastVisit: Date,
}
