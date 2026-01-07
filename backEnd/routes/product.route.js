import express from 'express'
import handelUserAuthorization from '../middleware/seller.authorized.middleware.js'
import { handelUserAuthentication } from '../middleware/authenticate.middleware.js'
import { handelAddProduct , handelGetallProducts , handelGetSearchProducts , handelGetRecommendedProducts , handelGetSponseredProducts ,handelGetSponseredStoreProducts } from "../controllers/product.controller.js"

const router = express.Router()

// router.post("/addproduct" , handelUserAuthentication , handelUserAuthorization , )
router.post("/addproduct" , handelUserAuthentication , handelUserAuthorization , handelAddProduct )
router.get("/getallproducts" , handelGetallProducts )
router.get("/getsearchproducts" , handelGetSearchProducts )
router.get("/getrecommendproduct" , handelGetRecommendedProducts )
router.get("/getsponserproduct" , handelGetSponseredProducts)
router.get("/getsponserstoreproduct/:storeId" , handelGetSponseredStoreProducts )

export default router

