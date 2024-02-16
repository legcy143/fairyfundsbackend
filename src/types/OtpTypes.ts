import { Document } from "mongoose";

export interface OtpTypes extends Document {
    email:string,
    otp :number,
    VerificationCode :number,
    otpGeneratorDetail:String,
    otpFor :string
    isValid:boolean
}