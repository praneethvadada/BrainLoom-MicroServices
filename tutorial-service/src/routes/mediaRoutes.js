// src/routes/mediaRoutes.js
import express from "express";
import { requireAdmin } from "../middleware/roleMiddleware.js";
import { getUploadUrl, deleteObject } from "../services/s3.service.js";

const router = express.Router();

/**
 * POST /api/media/upload-url
 * Body: { filename: string, contentType: string }
 * Returns: { uploadUrl, publicUrl, s3Key }
 *
 * Admin picks a file → frontend requests this URL → uploads directly to S3.
 */
router.post("/upload-url", requireAdmin, async (req, res) => {
  try {
    const { filename, contentType } = req.body;
    if (!filename || !contentType) {
      return res.status(400).json({ message: "filename and contentType are required" });
    }
    // Basic content-type guard — images only
    if (!contentType.startsWith("image/")) {
      return res.status(400).json({ message: "Only image uploads are allowed" });
    }
    const result = await getUploadUrl(filename, contentType);
    return res.json(result);
  } catch (err) {
    console.error("upload-url error:", err);
    return res.status(500).json({ message: "Failed to generate upload URL" });
  }
});

/**
 * DELETE /api/media?key=tutorials/uploads/uuid.ext
 * Deletes an object from S3 by s3Key passed as a query param.
 */
router.delete("/", requireAdmin, async (req, res) => {
  try {
    const s3Key = req.query.key;
    if (!s3Key) return res.status(400).json({ message: "key query param required" });
    await deleteObject(s3Key);
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error("media delete error:", err);
    return res.status(500).json({ message: "Failed to delete object" });
  }
});

export default router;
