import { transporter } from "../config/NODEMAILER"


export const SendMail = async (email: string , subject="", boilerplate: any) => {
    const mailOptions: any = {
        from: '"fairyfund" <mani976623@gmail.com>',
        to: email,
        subject: subject,
        html: boilerplate ?? '<h1>some thing went wrong with server</h1>',
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        // console.log("Email sent successfully:", info);
        return 1;
    } catch (err) {
        console.log('Error occurred on sending mail:', err);
        return -1;
    }
    // finally{}
}