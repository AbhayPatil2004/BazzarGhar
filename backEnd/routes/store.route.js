import express from 'express'
import { handelUserAuthentication } from '../middleware/authenticate.middleware.js'
import { handleCreateStore , handelGetAllStores , handelGetSearchedStore} from '../controllers/store.controller.js'

const router = express.Router()

router.post(
  "/createstore",
  handelUserAuthentication,
  
  handleCreateStore
);

router.get("/getallstores" , handelGetAllStores)
router.post("/searchstore" , handelGetSearchedStore )

export default router
 