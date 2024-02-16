export default function UpdateEmailOtpTemplate(otp: any , time:any) {
    return (
        `
        <h1>otp for update email</h1>
        <p>${otp}</p>
        <p>time : ${time}</p>
        `
    )
}