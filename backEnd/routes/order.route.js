import express from 'express'
import { handelPlaceSingelItemOrder , handelPlaceCartItemsOrder } from "../controllers/order.controller.js";
import { handelUserAuthentication } from "../middleware/authenticate.middleware.js";

const router = express.Router()

router.post("/singleorder/:productid" , handelUserAuthentication , handelPlaceSingelItemOrder )
router.post("/cartorder" , handelUserAuthentication , handelPlaceCartItemsOrder)

export default router 