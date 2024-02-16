"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function UpdateEmailOtpTemplate(otp, time) {
    return (`
        <h1>otp for update email</h1>
        <p>${otp}</p>
        <p>time : ${time}</p>
        `);
}
exports.default = UpdateEmailOtpTemplate;
