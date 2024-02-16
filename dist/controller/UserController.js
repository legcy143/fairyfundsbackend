"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateUs = exports.ChangePassword = exports.UpdateEmail = exports.SendOtpToEmail = exports.RemoveAllNotification = exports.MarkAllSeenNotification = exports.EditProfile = exports.FetchProfile = exports.UserLogin = exports.UserSignup = void 0;
const User_1 = __importDefault(require("../Schema/User"));
const jwt_1 = require("../misc/jwt");
const asyncHandler_1 = __importDefault(require("../utils/handler/asyncHandler"));
const Response_1 = require("../utils/response/Response");
const SendMail_1 = require("../helper/SendMail");
const UpdateEmailOtpTemplate_1 = __importDefault(require("../templates/email/UpdateEmailOtpTemplate"));
const Otp_1 = __importDefault(require("../Schema/Otp"));
const OtpUtils_1 = require("../utils/generator/OtpUtils");
exports.UserSignup = (0, asyncHandler_1.default)(async (req, res) => {
    const { userName, password } = req.body;
    let user;
    user = await User_1.default.findOne({ userName });
    if (user) {
        return res.status(400).send({
            success: false,
            message: `User with Username ${userName} is taken`,
        });
    }
    user = await User_1.default.create({
        userName, password
    });
    let jwt = (0, jwt_1.GenrateJwtToken)({ _id: user._id });
    return res.status(200).send({
        success: true,
        user,
        jwt,
    });
});
exports.UserLogin = (0, asyncHandler_1.default)(async (req, res) => {
    const { userName, password } = req.body;
    let user;
    user = await User_1.default.findOne({ userName, password });
    if (user) {
        let jwt = (0, jwt_1.GenrateJwtToken)({ _id: user._id }, '24h');
        return res.status(200).send({
            success: true,
            user,
            jwt
        });
    }
    return (0, Response_1.errorResponse)(res, 404, "Wrong credential");
});
exports.FetchProfile = (0, asyncHandler_1.default)(async (req, res) => {
    let user;
    user = await User_1.default.findOneAndUpdate({ _id: req.body.userID }, { lastVisit: new Date() }, { new: true });
    if (user) {
        // let jwt = GenrateJwtToken({ _id: user._id })
        return res.status(200).send({
            success: true,
            user,
        });
    }
    return res.status(404).send({
        success: false,
        message: "User Not Found"
    });
});
exports.EditProfile = (0, asyncHandler_1.default)(async (req, res) => {
    const { name, userName, bio, myLocation, gender, isPrivate } = req.body;
    let user;
    // user = await User.findOne({ _id: req.body.userID })
    user = await User_1.default.findByIdAndUpdate({ _id: req.body.userID }, { name, userName, bio, myLocation, gender, isPrivate }, { new: true });
    if (user) {
        return res.status(200).send({
            success: true,
            user,
        });
    }
    return (0, Response_1.errorResponse)(res, 404, "User Not Found");
});
exports.MarkAllSeenNotification = (0, asyncHandler_1.default)(async (req, res) => {
    const { userID } = req.body;
    // console.log("hii " , userID)
    let user = await User_1.default.findOneAndUpdate({ _id: userID }, {
        $set: {
            'notifications.$[].isSeen': true,
        }
    }, { new: true });
    if (user) {
        return (0, Response_1.successResponse)(res, 200, "notification is marked as seen succesfully", user);
    }
    return (0, Response_1.errorResponse)(res, 404, "Notification not found");
});
exports.RemoveAllNotification = (0, asyncHandler_1.default)(async (req, res) => {
    const { userID } = req.body;
    let user = await User_1.default.findOneAndUpdate({ _id: userID }, {
        $set: {
            notifications: []
        }
    }, { new: true });
    if (user) {
        return (0, Response_1.successResponse)(res, 200, "Remove all notificaion successfully", user);
    }
    return (0, Response_1.errorResponse)(res, 404, "Notification not found");
});
exports.SendOtpToEmail = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, otpGeneratorDetail, userID } = req.body;
    let detail = { ...otpGeneratorDetail, genBy: userID };
    detail = JSON.stringify(otpGeneratorDetail);
    let newOtpCode = (0, OtpUtils_1.OtpGenerator)();
    let VerificationCode = (0, OtpUtils_1.VerificationCodeGenerator)();
    // console.log(email , otpGeneratorDetail)
    let resp = await (0, SendMail_1.SendMail)(email, "Update email otp", (0, UpdateEmailOtpTemplate_1.default)(newOtpCode, new Date().toLocaleString()));
    // return successResponse(res ,) 
    if (resp == -1) {
        return (0, Response_1.errorResponse)(res, 500);
    }
    let otpRes = await Otp_1.default.findOneAndUpdate({ email }, {
        otp: newOtpCode,
        isValid: true,
        VerificationCode,
        otpGeneratorDetail: detail
    }, { new: true });
    if (!otpRes) {
        otpRes = await Otp_1.default.create({
            email,
            otp: newOtpCode,
            VerificationCode,
            otpGeneratorDetail
        });
    }
    return (0, Response_1.successResponse)(res, undefined, "otp send succesfully");
});
exports.UpdateEmail = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, otp, userID } = req.body;
    let otpRes = await Otp_1.default.findOneAndUpdate({ email, otp }, {
        isValid: false,
    });
    let VerificationCode = (0, OtpUtils_1.VerificationCodeGenerator)();
    if (otpRes && VerificationCode - otpRes.VerificationCode <= 600 && otp == otpRes.otp && otpRes.isValid) {
        let data = JSON.stringify({ visit: "profile" });
        let user = await User_1.default.findOneAndUpdate({ _id: userID }, {
            email,
            $push: {
                notifications: {
                    $each: [{
                            title: "Email update",
                            message: `your email was update , see your profile for more detail`,
                        }],
                    $position: 0,
                }
            }
        }, { new: true });
        if (user) {
            return (0, Response_1.successResponse)(res, 200, "update email successfully", user);
        }
    }
    return (0, Response_1.errorResponse)(res, 404, "Invalid otp");
});
exports.ChangePassword = (0, asyncHandler_1.default)(async (req, res) => {
    const { OldPassword, NewPassword, userID } = req.body;
    let user = await User_1.default.findById({ _id: userID }).select("password");
    console.log(user);
    if (user && OldPassword == user?.password) {
        let user = await User_1.default.findOneAndUpdate({ _id: userID }, {
            password: NewPassword,
            $push: {
                notifications: {
                    $each: [{
                            title: "Password Change",
                            message: `your Password was change , see your profile for more detail`,
                        }],
                    $position: 0,
                }
            }
        }, { new: true });
        if (user) {
            return (0, Response_1.successResponse)(res, 200, "change password successfully");
        }
    }
    return (0, Response_1.errorResponse)(res, 404, "old password is incorrect");
});
exports.RateUs = (0, asyncHandler_1.default)(async (req, res) => {
    const { star, message, userID } = req.body;
    let user = await User_1.default.findOneAndUpdate({ _id: userID }, {
        rating: {
            star,
            message,
        },
        $push: {
            notifications: {
                $each: [{
                        title: "Thank You",
                        message: `Thank you for you rating we love to hear it from you`,
                    }],
                $position: 0,
            }
        }
    }, { new: true });
    if (user) {
        return (0, Response_1.successResponse)(res, 200, "rating recorded thatnk you for this", user);
    }
    return (0, Response_1.errorResponse)(res, 404, "something went wrong");
});
// export const SendFeedBack = asyncHandler(async (req: Request, res: Response) => {
// })
