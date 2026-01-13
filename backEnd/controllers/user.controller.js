import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import setJwtTokenCookie from "../utils/setJwtCookie.js";
import ApiResponse from "../utils/ApiResponse.js";
import sendMailToUser from "../utils/sendMail.js";
import saveOtp from "../utils/otpStore.js";
import redisClient from "../redisConnect/redisConnect.js";
import otpBody from "../emailBody/otp.emailBody.js";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function handleUserSignUp(req, res) {

  try {

    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      console.log("Username, email, and password are required ")
      return res.status(400).json(
        new ApiResponse(400, null, "Username, email, and password are required")
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists")
      return res.status(409).json(
        new ApiResponse(409, null, "User already exists")
      );
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Password must be at least 6 characters and include uppercase, lowercase, number, and special character")
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (email == "patilabhay484@gmail.com") {
      user.role = "admin"
      await user.save()
    }
    if (!user) {
      console.log("Something went wrong during user creation")
      return res.status(500).json(
        new ApiResponse(500, null, "Something went wrong during user creation")
      );
    }

    await setJwtTokenCookie(res, user)

    const otp = generateOtp();

    await saveOtp(email, otp)
    const subject = "To verify Email Through Otp"
    sendMailToUser(email, subject, otpBody(username, otp))
      .catch(err => {
        console.error("Email failed:", err);
        // optional: retry / log / alert
      });
    return res.status(201).json(
      new ApiResponse(201, { user }, "User registered successfully")
    );
    // return res.status(201).json(
    //   new ApiResponse(201, {  }, "User registered successfully")
    // );

  } catch (error) {

    console.error("Signup error:", error);

    return res.status(500).json(
      new ApiResponse(500, null, "Internal server error")
    );
  }
}

async function handelUserLogin(req, res) {

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      console.log("Email and password required")
      return res.status(400).json(
        new ApiResponse(400, {}, "Email and password are required")
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("Invalid Email")
      return res.status(400).json(
        new ApiResponse(400, {}, "Invalid email address")
      );
    }


    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      console.log("Invalid password")
      return res.status(400).json(
        new ApiResponse(400, {}, "Invalid password")
      );
    }

    if (email === "patilabhay484@gmail.com") {
      await User.findOneAndUpdate(
        { email },
        { role: "admin" },
        { new: true }
      );
    }

    setJwtTokenCookie(res, user);

    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    console.log("Login in Succesfull")
    return res.status(200).json(
      new ApiResponse(200, { user: userData }, "Login successful")
    );

  } catch (error) {
    console.error(error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Something went wrong")
    );
  }
}

async function handelUserLogout(req, res) {

  try {

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    })

    return res.status(200).json(
      new ApiResponse(200, {}, "Logout successful")
    );
  }
  catch (error) {
    return res.status(500).json(
      new ApiResponse(500, {}, "Something went Wrong")
    )
  }
}

async function handelVerifyEmailOtp(req, res) {

  try {
    const { otp } = req.body;
    const { email } = req.user;

    if (!otp) {
      return res.status(400).json(
        new ApiResponse(400, null, "OTP is required")
      );
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json(
        new ApiResponse(404, null, "User not found")
      );
    }

    const key = `otp:${email}`;
    const savedOtp = await redisClient.get(key);

    if (!savedOtp) {
      return res.status(400).json(
        new ApiResponse(400, null, "OTP expired or invalid")
      );
    }

    if (savedOtp !== otp.toString()) {
      return res.status(400).json(
        new ApiResponse(400, null, "Invalid OTP")
      );
    }

    existingUser.isEmailVerified = true;
    await existingUser.save();

    await redisClient.del(key);

    return res.status(200).json(
      new ApiResponse(200, null, "Email verified successfully")
    );

  } catch (error) {
    console.error(error);
    return res.status(500).json(
      new ApiResponse(500, null, "Something went wrong")
    );
  }
}

async function handelForgotPassword(req, res) {

  try {

    const { email } = req.body;

    if (!email || email.trim() === "" || !email.endsWith("@gmail.com")) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Valid Gmail address is required")
      );
    }

    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(400).json(
        new ApiResponse(400, {}, "User Dont exits with this email")
      );
    }

    setJwtTokenCookie(res, user)

    const { username } = user;
    const otp = generateOtp();

    await saveOtp(email, otp)
    const subject = "To verify user through Through Otp"
    sendMailToUser(email, subject, otpBody(username, otp))
      .catch(err => {
        console.error("Email failed:", err);
        // optional: retry / log / alert
      });
    return res.status(200).json(
      new ApiResponse(200, {}, "Otp send Succesfully")
    );

  }
  catch (error) {
    console.log(error)
    return res.status(500).json(
      new ApiResponse(500, {}, "Something went wrong")
    )
  }
}

async function handelResendOtp(req, res) {

  try {
    const { email , username } = req.user;

    const otp = generateOtp();

    await saveOtp(email, otp)
    const subject = "To verify Email Through Otp"
    sendMailToUser(email, subject, otpBody(username, otp))
      .catch(err => {
        console.error("Email failed:", err);
        
      });
    return res.status(201).json(
      new ApiResponse(201, { user }, "User registered successfully")
    );
  }
  catch (error) {
    console.log(error)
    return res.status(500).json(
      new ApiResponse(500, {}, "Something went wrong")
    )
  }
}

async function handelClearUser(req, res) {
  try {
    await User.deleteMany({});

    return res.status(200).json(
      new ApiResponse(200, {}, "All users deleted successfully")
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Something went wrong")
    );
  }
}


export { handleUserSignUp, handelVerifyEmailOtp, handelUserLogin, handelUserLogout, handelForgotPassword, handelClearUser , handelResendOtp };
