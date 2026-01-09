import express from 'express'
import { handelGetProductReviews , handelAddProdcutReview } from "../controllers/review.controller.js";

const router = express.Router()

router.get("/reviews" , handelGetProductReviews )
router.post("/addreview" , handelAddProdcutReview )

export default router