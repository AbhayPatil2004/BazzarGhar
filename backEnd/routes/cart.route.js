import express from 'express'
import { handelClearCart , handelRemoveProductFromCart , handelAddProductInCart , handelGetCartProduct , handelUpdateProductQuantity , handelUpdateProductColor } from '../controllers/cart.controller.js'
import { handelUserAuthentication } from '../middleware/authenticate.middleware.js'

const router = express.Router()

router.get("/" , handelUserAuthentication , handelGetCartProduct )
router.post("/add/:productId" , handelUserAuthentication , handelAddProductInCart )
router.delete("/remove/:productId" , handelUserAuthentication , handelRemoveProductFromCart )
router.put("/update-quantity/:productId" , handelUserAuthentication , handelUpdateProductQuantity )
router.put("/update-color/:productId" , handelUserAuthentication , handelUpdateProductColor )
router.delete("/clear" , handelUserAuthentication , handelClearCart )

export default router