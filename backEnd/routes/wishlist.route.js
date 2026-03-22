import express from "express";
import {
  handelToggleWishlist,
  handelGetWishlistIds,
  handelGetWishlist,
  handelCheckWishlist,
} from "../controllers/wishlist.controller.js";

import { handelUserAuthentication } from '../middleware/authenticate.middleware.js'

const router = express.Router();

router.post("/toggle/:productId",     handelUserAuthentication, handelToggleWishlist);
router.get("/ids",                    handelUserAuthentication, handelGetWishlistIds);
router.get("/",                       handelUserAuthentication, handelGetWishlist);
router.get("/check/:productId",       handelUserAuthentication, handelCheckWishlist);

export default router;