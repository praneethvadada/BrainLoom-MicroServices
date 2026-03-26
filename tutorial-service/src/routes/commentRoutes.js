// src/routes/commentRoutes.js
import express from "express";
// import { authenticate } from "../middleware/authMiddleware.js";
import * as CommentCtrl from "../controllers/commentController.js";

const router = express.Router();

router.post("/topics/:topicId/comments",  CommentCtrl.postComment);
router.get("/topics/:topicId/comments", CommentCtrl.getComments);
router.post("/comments/:commentId/like", CommentCtrl.likeComment);

export default router;
