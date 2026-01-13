import express from 'express'
import { handleUserSignUp , handelVerifyEmailOtp , handelUserLogin , handelUserLogout , handelForgotPassword , handelClearUser , handelResendOtp , handelForgotPasswordOtp , handelResetPassword } from "../controllers/user.controller.js"
import { handelUserAuthentication } from '../middleware/authenticate.middleware.js'

const router = express.Router()

router.post("/signup" , handleUserSignUp)
router.post("/login" , handelUserAuthentication , handelUserLogin ) 
router.post("/logout" ,  handelUserLogout )
router.post("/verifyemail" , handelUserAuthentication , handelVerifyEmailOtp )
router.post("/forgotpassword" ,  handelForgotPassword )
router.post("/verifyforgotpassword" , handelUserAuthentication , handelForgotPasswordOtp )
router.post("/resendotp" , handelUserAuthentication , handelResendOtp )
router.post("/resetpassword" , handelUserAuthentication , handelResetPassword)

router.delete("/clear" , handelClearUser)

export default router 