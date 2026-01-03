import express from 'express'
import { handelUserAuthentication } from '../middleware/authenticate.middleware.js'
import { handleCreateStore } from '../controllers/store.controller.js'
import handelMulterUpload from '../middleware/multer.middleware.js'

const router = express.Router()

router.post(
  "/createstore",
  handelUserAuthentication,
  handelMulterUpload.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 }
  ]),
  handleCreateStore
);

export default router
