import express, { Router } from 'express'
import { handelGetStoreReviews , handleAddStoreReview } from '../controllers/storeReview.controller.js'
import { handelUserAuthentication } from '../middleware/authenticate.middleware.js'

const router = express.Router()

router.get("/:storeId" , handelGetStoreReviews )
router.post("/:storeId" , handelUserAuthentication , handleAddStoreReview )

export default router