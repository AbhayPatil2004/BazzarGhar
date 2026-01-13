import express from 'express'
import { handleUserSignUp , handelVerifyEmailOtp , handelUserLogin , handelUserLogout , handelForgotPassword , handelClearUser , handelResendOtp } from "../controllers/user.controller.js"
import { handelUserAuthentication } from '../middleware/authenticate.middleware.js'

const router = express.Router()

router.post("/signup" , handleUserSignUp)
router.post("/verifyemail" , handelUserAuthentication , handelVerifyEmailOtp )
router.post("/login" , handelUserAuthentication , handelUserLogin ) 
router.post("/logout" ,  handelUserLogout )
router.post("/forgotpassword" ,  handelForgotPassword )

router.post("/resendotp" , handelUserAuthentication , handelResendOtp )
router.delete("/clear" , handelClearUser)

export default router 