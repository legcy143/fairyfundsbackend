export const VerificationCodeGenerator = () => {
    let x = new Date().toLocaleString();
    const [fst, sec] = x.split(", ")
    return parseInt((`${fst.split("/").join("")}${sec.split(":").join("")}`).split(" ")[0])
  }
  
export const OtpGenerator = () => {
    const min = 99999;
    const max = 1000000;
    const genOtp = Math.floor(Math.random() * (max - min + 1)) + min;
    return genOtp;
  }
  