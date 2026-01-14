import express from 'express'
import { handleGetUserDetails , handelUpdateProfile , handleUserSignUp , handelVerifyEmailOtp , handelUserLogin , handelUserLogout , handelForgotPassword , handelClearUser , handelResendOtp , handelForgotPasswordOtp , handelResetPassword , handelUpdateUserAddress } from "../controllers/user.controller.js"
import { handelUserAuthentication } from '../middleware/authenticate.middleware.js'

const router = express.Router()

router.get("/" , handelUserAuthentication , handleGetUserDetails )
router.patch("/update" , handelUserAuthentication , handelUpdateProfile )
router.put("/address" , handelUserAuthentication , handelUpdateUserAddress  )

router.post("/signup" , handleUserSignUp)
router.post("/login" , handelUserLogin ) 
router.post("/logout" , handelUserLogout )
router.post("/verifyemail" , handelUserAuthentication , handelVerifyEmailOtp )
router.post("/forgotpassword" ,  handelForgotPassword )
router.post("/verifyforgotpassword" , handelForgotPasswordOtp )
router.post("/resendotp" , handelUserAuthentication , handelResendOtp )
router.post("/resetpassword" , handelUserAuthentication , handelResetPassword)

router.delete("/clear" , handelClearUser)

export default router 