import express from 'express'
import { handelUserAuthentication } from '../middleware/authenticate.middleware.js'
import {  handleCreateStore , handelGetAllStores , handelGetSearchedStore , handelClearStore , handelGetTopSeller , handelGetNewlyOpened , handelGetStoresOfMycities , handelGetFeaturedStores } from '../controllers/store.controller.js'
import handelUserAuthorization from '../middleware/seller.authorized.middleware.js';

const router = express.Router()

router.post(
  "/create",
  handelUserAuthentication,
  handleCreateStore
);

// router.get("/my/:ownerId" , handelUserAuthentication , handelUserAuthorization , handelGetStoreByOwner )
// router.get("/my/:storeId" , handelUserAuthentication , handelUserAuthorization , handelGetStoreByIdForSeller )

router.get("/top-seller" , handelGetTopSeller )
router.get("/newly-opened" , handelGetNewlyOpened )
router.get("/my-city" , handelUserAuthentication , handelGetStoresOfMycities )
router.get("/featured" , handelGetFeaturedStores )

router.get("/" , handelGetAllStores)
router.post("/search" , handelGetSearchedStore )

router.delete("/clear" , handelClearStore)

export default router
 