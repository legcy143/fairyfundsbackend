import mongoose, { Mongoose, Schema } from "mongoose";
import { OtpTypes } from "../types/OtpTypes";

export const OtpSchema: Schema<OtpTypes> = new Schema<OtpTypes>({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String
    },
    VerificationCode: {
        type: Number
    },
    otpFor: {
        type: String,
        default:"authentication"
    },
    isValid: {
        type: Boolean,
        default:true
    },
    location:{
        type:String,
        default:""
    },
    firstVisitAt : {
        type: Date,
        default: new Date(),
    }
});
const Otp = mongoose.model<OtpTypes>("Otp", OtpSchema);
export default Otp;