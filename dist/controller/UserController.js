"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchProfile = exports.UserLogin = exports.UserSignup = void 0;
const User_1 = __importDefault(require("../Schema/User"));
const jwt_1 = require("../misc/jwt");
const UserSignup = async (req, res) => {
    try {
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
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.UserSignup = UserSignup;
const UserLogin = async (req, res) => {
    try {
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
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.UserLogin = UserLogin;
const FetchProfile = async (req, res) => {
    try {
        let user;
        user = await User_1.default.findOne({ _id: req.body.userID });
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
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.FetchProfile = FetchProfile;
