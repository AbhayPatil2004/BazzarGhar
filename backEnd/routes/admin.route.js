import express from 'express'
import { handelUserAuthentication } from '../middleware/authenticate.middleware.js'
import { handelStoreOpeningReq , handelApproveStore , handelRejectStore } from '../controllers/admin.controller.js'
import handelUserAuthorization from '../middleware/admin.authorized.middleware.js'


const router = express.Router()

router.get( "/storeopeningreq" , handelUserAuthentication , handelUserAuthorization , handelStoreOpeningReq )
// router.post("/approvestore/:storeId" , handelUserAuthentication , handelUserAuthorization , handelApproveStore )
// router.post("/rejectstore/:storeId" , handelUserAuthentication , handelUserAuthorization , handelApproveStore )
router.post("/approvestore" , handelUserAuthentication , handelUserAuthorization , handelApproveStore )
router.post("/rejectstore" , handelUserAuthentication , handelUserAuthorization , handelRejectStore )

export default router