import express from 'express'
import { handelUserAuthentication , handelUserLogin } from '../middleware/authenticate.middleware.js'
import {  handleCreateStore , handelGetAllStores , handelGetSearchedStore , handelClearStore , handelGetTopSeller , handelGetNewlyOpened , handelGetStoresOfMycities , handelGetFeaturedStores , handleGetFilteredStores , handleGetStoreDetails , handelGetStoresByOwner , handleGetStoresByCategory } from '../controllers/store.controller.js'
import handelUserAuthorization from '../middleware/seller.authorized.middleware.js';

const router = express.Router()

router.post(
  "/create",
  handelUserAuthentication,
  handleCreateStore
);

// router.get("/my/:ownerId" , handelUserAuthentication , handelUserAuthorization , handelGetStoreByOwner )
// router.get("/my/:storeId" , handelUserAuthentication , handelUserAuthorization , handelGetStoreByIdForSeller )
router.post("/category", handleGetStoresByCategory);

router.get("/top-seller" , handelGetTopSeller )
router.get("/newly-opened" , handelGetNewlyOpened )
router.get("/my-city" , handelUserAuthentication , handelGetStoresOfMycities )
router.get("/featured" , handelGetFeaturedStores )


router.get("/filter", handelUserLogin , handleGetFilteredStores);

router.get("/" , handelGetAllStores)
router.post("/search" , handelGetSearchedStore )

router.delete("/clear" , handelClearStore)

router.get("/:storeId" , handleGetStoreDetails )
router.get("/owner/:ownerId", handelGetStoresByOwner );

export default router
 