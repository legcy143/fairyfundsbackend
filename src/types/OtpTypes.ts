import { Document } from "mongoose";

export interface OtpTypes extends Document {
    email:string,
    otp :string,
    VerificationCode :number,
    location:String,
    otpFor :string
    isValid:boolean
    firstVisitAt:Date
}