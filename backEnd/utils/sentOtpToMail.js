import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import nodemailer from "nodemailer";

async function sendOtpToMail( email , otp  ){
    
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD,
        }
    })

    await transporter.sendMail({
        from : process.env.EMAIL_USER,
        to : email ,
        subject : "Email verification through OTP",
        text : `Please enter ${otp} on Webpage for Email Verification`

    })

    console.log("Otp send to email Succesfully")
}

export default sendOtpToMail 