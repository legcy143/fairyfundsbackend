"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveAllNotification = exports.MarkAllSeenNotification = exports.EditProfile = exports.FetchProfile = exports.UserLogin = exports.UserSignup = void 0;
const User_1 = __importDefault(require("../Schema/User"));
const jwt_1 = require("../misc/jwt");
const asyncHandler_1 = __importDefault(require("../utils/handler/asyncHandler"));
const Response_1 = require("../utils/response/Response");
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
    return res.status(404).send({
        success: false,
        message: "User Not Found"
    });
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
    const { name, userName, bio, myLocation, phoneNumber, email, gender, isPrivate } = req.body;
    let user;
    // user = await User.findOne({ _id: req.body.userID })
    user = await User_1.default.findByIdAndUpdate({ _id: req.body.userID }, { name, userName, bio, myLocation, phoneNumber, email, gender, isPrivate, updatedAt: new Date() }, { new: true });
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
// export const SendFeedBack = asyncHandler(async (req: Request, res: Response) => {
// })
