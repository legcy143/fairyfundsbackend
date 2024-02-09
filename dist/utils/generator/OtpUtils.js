"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpGenerator = exports.VerificationCodeGenerator = void 0;
const VerificationCodeGenerator = () => {
    let x = new Date().toLocaleString();
    const [fst, sec] = x.split(", ");
    return parseInt((`${fst.split("/").join("")}${sec.split(":").join("")}`).split(" ")[0]);
};
exports.VerificationCodeGenerator = VerificationCodeGenerator;
const OtpGenerator = () => {
    const min = 99999;
    const max = 1000000;
    const genOtp = Math.floor(Math.random() * (max - min + 1)) + min;
    return genOtp;
};
exports.OtpGenerator = OtpGenerator;
