import express from 'express'
import { handelPlaceSingelItemOrder , handelPlaceCartItemsOrder , handelClearOrder , handelCreateRazorpayOrder , handelVerifyPayment } from "../controllers/order.controller.js";
import { handelUserAuthentication } from "../middleware/authenticate.middleware.js";

const router = express.Router()

router.post("/singleorder/:productid" , handelUserAuthentication , handelPlaceSingelItemOrder )
router.post("/place-from-cart" , handelUserAuthentication , handelPlaceCartItemsOrder)
router.post("/create-razorpay-order" , handelUserAuthentication , handelCreateRazorpayOrder)
router.post("/verify-payment" , handelUserAuthentication , handelVerifyPayment)
router.post("/clear" , handelClearOrder )

export default router 