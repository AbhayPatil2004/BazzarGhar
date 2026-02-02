import express from "express";
import { handelUserAuthentication } from "../middleware/authenticate.middleware.js";
import handelUserAuthorization from "../middleware/admin.authorized.middleware.js";

import {
  handelGetStoreDetails,
  handelStoreOpeningReq,
  handelApproveStore,
  handelRejectStore,
  handelGetAllUserSellerProductsCount,
  handelGetUsers
} from "../controllers/admin.controller.js";

const router = express.Router();

/* ================== STATS ================== */
router.get(
  "/stats",
  handelUserAuthentication,
  handelUserAuthorization,
  handelGetAllUserSellerProductsCount
);

/* ================== USERS ================== */
router.get(
  "/users",
  handelUserAuthentication,
  handelUserAuthorization,
  handelGetUsers
);

/* ================== STORE REQUESTS ================== */
router.get(
  "/openingreq",
  handelUserAuthentication,
  handelUserAuthorization,
  handelStoreOpeningReq
);

/* ================== STORE ACTIONS ================== */
router.patch(
  "/accept/:storeId",
  handelUserAuthentication,
  handelUserAuthorization,
  handelApproveStore
);

router.patch(
  "/reject/:storeId",
  handelUserAuthentication,
  handelUserAuthorization,
  handelRejectStore
);

/* ================== STORE DETAILS (ALWAYS LAST) ================== */
router.get(
  "/store/:storeId",   // 👈 IMPORTANT CHANGE
  handelUserAuthentication,
  handelUserAuthorization,
  handelGetStoreDetails
);

export default router;
