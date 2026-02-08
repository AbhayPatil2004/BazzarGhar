import express from 'express'
import handelUserAuthorization from '../middleware/seller.authorized.middleware.js'
import { handelUserAuthentication } from '../middleware/authenticate.middleware.js'
import { handelGetStoreByIdForSeller , handelGetStoreByOwner , handelUpgradeStoreSubscription , handelCreateStoreSubscriptionOrder , handleAddProductToStore , handelSellerStats , handleUpdateStoreDetails , handelActiveOrInActiveStore , handelGetStoreProducts, handelGetProductDetails } from '../controllers/seller.controller.js'

const router = express.Router()

router.get( "/stats" , handelUserAuthentication , handelUserAuthorization , handelSellerStats )
router.get("/store/:storeId" , handelUserAuthentication , handelUserAuthorization , handelGetStoreByIdForSeller )
router.get("/store/:storeId/products" , handelUserAuthentication , handelUserAuthorization , handelGetStoreProducts )
router.get("/store/:storeId/products/:productId" , handelUserAuthentication , handelUserAuthorization , handelGetProductDetails )
router.put("/store/:storeId" , handelUserAuthentication , handelUserAuthorization ,  handleUpdateStoreDetails )
router.put("/store/toggleactive/:storeId" , handelUserAuthentication , handelUserAuthorization ,  handelActiveOrInActiveStore )
// router.put("/store/inactive/:storeId" , handelUserAuthentication , handelUserAuthorization ,  handelActiveOrInActiveStore )
router.get("/owner/:ownerId" , handelUserAuthentication , handelUserAuthorization , handelGetStoreByOwner )
router.post("/store/createsubscriptionorder" , handelUserAuthentication , handelUserAuthorization , handelCreateStoreSubscriptionOrder )
router.post("/store/upgradesubscription/:storeId" , handelUserAuthentication , handelUserAuthorization , handelUpgradeStoreSubscription )
router.post("/store/addproduct/:storeId" , handelUserAuthentication , handelUserAuthorization , handleAddProductToStore )

export default router