import mongoose, { Mongoose, Schema } from "mongoose";
import { OtpTypes } from "../types/OtpTypes";
import OtptypeEnum from "../enums/OtpTypeEnum";

export const OtpSchema: Schema<OtpTypes> = new Schema<OtpTypes>({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        default:0
    },
    VerificationCode: {
        type: Number
    },
    otpFor: {
        type: String,
        default:OtptypeEnum.default
    },
    isValid: {
        type: Boolean,
        default:true
    },
    otpGeneratorDetail:{
        type:String,
        default:""
    },
},{timestamps:true});
const Otp = mongoose.model<OtpTypes>("Otp", OtpSchema);
export default Otp;