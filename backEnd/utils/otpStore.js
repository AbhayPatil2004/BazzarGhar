import redisClient from "../redisConnect/redisConnect.js";

async function saveOtp(email, otp) {

  console.log("Otp saving")
  const otpData = {
    otp: 123456,
    email: "abc@gmail.com",
  };

  await redisClient.set(
    "otp:abc@gmail.com",
    JSON.stringify(otpData)
  );

}

export default saveOtp