export const NODEMAILER_CONFIG ={
    service: 'Gmail',
    auth: {
      user: process.env.NODEMAILER_CONFIG_EMAIL,
      pass: process.env.NODEMAILER_CONFIG_EMAIL_PASSWORD // Replace with the generated app password
      //user: 'mani976623@gmail.com',
      //pass: 'qnukqpwureosctmp' // Replace with the generated app password
    }
  }