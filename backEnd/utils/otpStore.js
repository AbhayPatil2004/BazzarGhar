import redisClient from "../redisConnect/redisConnect.js";

async function saveOtp(email, otp) {
  const key = `otp:${email}`;

  await redisClient.set(
    key,
    otp.toString(),   
    {
      EX: 300         
    }
  );

  console.log("OTP saved in Redis");
}

export default saveOtp;
