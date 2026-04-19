// src/routes/topicBlockRoutes.js
import express from "express";
import { requireAdmin } from "../middleware/roleMiddleware.js";
import * as BlockCtrl from "../controllers/topicBlockController.js";

const router = express.Router();

// Public: get all blocks for a topic
router.get("/", BlockCtrl.getBlocks);

// Admin only: create, update, reorder, delete
router.post("/",           requireAdmin, BlockCtrl.createBlock);
router.put("/:id",         requireAdmin, BlockCtrl.updateBlock);
router.patch("/reorder",   requireAdmin, BlockCtrl.reorderBlocks);
router.delete("/:id",      requireAdmin, BlockCtrl.deleteBlock);

export default router;
