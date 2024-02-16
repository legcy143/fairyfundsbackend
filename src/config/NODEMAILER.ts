import nodemailer from "nodemailer"

export const NODEMAILER_CONFIG ={
    service: 'Gmail',
    auth: {
      user: process.env.NODEMAILER_CONFIG_EMAIL,
      pass: process.env.NODEMAILER_CONFIG_EMAIL_PASSWORD // Replace with the generated app password
    }
  }
  // console.log("nodemialer config " , NODEMAILER_CONFIG)
  export const transporter = nodemailer.createTransport(NODEMAILER_CONFIG);