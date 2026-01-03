import express from 'express'
import { handleUserSignUp , verifyEmailOtp , handelUserLogin , handelUserLogout } from "../controllers/user.controller.js"
import { handelUserAuthentication } from '../middleware/authenticate.middleware.js'

const router = express.Router()

router.post("/signup" , handleUserSignUp)
router.post("/verifyEmail" , handelUserAuthentication , verifyEmailOtp )
router.post("/login" , handelUserLogin ) 
router.post("/logout" ,  handelUserLogout )

export default router 