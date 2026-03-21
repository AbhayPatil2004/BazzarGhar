import express from 'express'
import handelUserAuthorization from '../middleware/seller.authorized.middleware.js'
import { handelUserAuthentication } from '../middleware/authenticate.middleware.js'
import { handelAddProduct , handelGetallProducts , handelGetSearchProducts , handelGetRecommendedProducts , handelGetSponseredProducts ,handelGetSponseredStoreProducts , handelClearProduct , handelGetProductSearchHistory , handelSaveProductSearch } from "../controllers/product.controller.js"

const router = express.Router()

router.get("/" , handelGetallProducts )
router.post("/add" , handelUserAuthentication , handelUserAuthorization , handelAddProduct )
router.get("/search" , handelGetSearchProducts )
router.get("/recommend" , handelGetRecommendedProducts )
router.get("/sponser" , handelGetSponseredProducts)
router.get("/sponserstore/:storeId" , handelGetSponseredStoreProducts )

router.get("/searchhistory", handelUserAuthentication, handelGetProductSearchHistory );
router.post("/savesearchhistory", handelUserAuthentication, handelSaveProductSearch );

router.delete("clear" , handelClearProduct)

export default router

