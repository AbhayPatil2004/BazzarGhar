import express from 'express'
import { handelUserAuthentication } from '../middleware/authenticate.middleware.js'
import { handelGetStoreByOwner , handleCreateStore , handelGetAllStores , handelGetSearchedStore , handelClearStore } from '../controllers/store.controller.js'
import handelUserAuthorization from '../middleware/seller.authorized.middleware.js';

const router = express.Router()

router.post(
  "/create",
  handelUserAuthentication,
  handleCreateStore
);

router.get("/my/:ownerId" , handelUserAuthentication , handelUserAuthorization , handelGetStoreByOwner )
router.get("/" , handelGetAllStores)
router.post("/search" , handelGetSearchedStore )

router.delete("/clear" , handelClearStore)

export default router
 