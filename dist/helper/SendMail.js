"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMail = void 0;
const NODEMAILER_1 = require("../config/NODEMAILER");
const SendMail = async (email, subject = "", boilerplate) => {
    const mailOptions = {
        from: '"fairyfund" <mani976623@gmail.com>',
        to: email,
        subject: subject,
        html: boilerplate ?? '<h1>some thing went wrong with server</h1>',
    };
    try {
        const info = await NODEMAILER_1.transporter.sendMail(mailOptions);
        // console.log("Email sent successfully:", info);
        return 1;
    }
    catch (err) {
        console.log('Error occurred on sending mail:', err);
        return -1;
    }
    // finally{}
};
exports.SendMail = SendMail;
