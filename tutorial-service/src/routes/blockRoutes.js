// src/routes/blockRoutes.js
import express from "express";
// import { authenticate } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";
import * as BlockCtrl from "../controllers/blockController.js";

const router = express.Router({ mergeParams: true });

router.post("/:topicId/blocks", requireAdmin, BlockCtrl.addBlock);

export default router;
