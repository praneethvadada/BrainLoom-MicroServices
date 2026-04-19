// src/controllers/topicBlockController.js
import * as BlockModel from "../models/topicBlockModel.js";

const VALID_TYPES = new Set([
  "heading", "paragraph", "code", "code_tabs",
  "image", "carousel", "note", "example", "link_block", "divider"
]);

// ── GET /api/topic-blocks?topic_id=123 ────────────────────────────────────────
export const getBlocks = async (req, res) => {
  try {
    const topic_id = parseInt(req.query.topic_id);
    if (!topic_id) return res.status(400).json({ message: "topic_id is required" });

    // Admins see unpublished blocks too
    const isAdmin = req.user?.role === "admin";
    const blocks = await BlockModel.getBlocksByTopic(topic_id, isAdmin);
    return res.json({ blocks });
  } catch (err) {
    console.error("getBlocks error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ── POST /api/topic-blocks ────────────────────────────────────────────────────
export const createBlock = async (req, res) => {
  try {
    const { topic_id, type, data, order_no, is_published } = req.body;

    if (!topic_id)           return res.status(400).json({ message: "topic_id is required" });
    if (!VALID_TYPES.has(type)) return res.status(400).json({ message: `Invalid block type: ${type}` });
    if (!data || typeof data !== "object")
                             return res.status(400).json({ message: "data object is required" });

    // If order_no not provided, append at end
    const finalOrder = order_no !== undefined
      ? Number(order_no)
      : (await BlockModel.getMaxOrder(topic_id)) + 1;

    const id = await BlockModel.createBlock({
      topic_id,
      type,
      data,
      order_no: finalOrder,
      is_published: is_published !== undefined ? (is_published ? 1 : 0) : 1,
    });

    return res.status(201).json({ id, message: "Block created" });
  } catch (err) {
    console.error("createBlock error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ── PUT /api/topic-blocks/:id ─────────────────────────────────────────────────
export const updateBlock = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid block id" });

    const { data, order_no, type, is_published } = req.body;
    const affected = await BlockModel.updateBlock(id, { data, order_no, type, is_published });

    if (!affected) return res.status(404).json({ message: "Block not found" });
    return res.json({ id, message: "Block updated" });
  } catch (err) {
    console.error("updateBlock error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ── PATCH /api/topic-blocks/reorder ──────────────────────────────────────────
// Body: { updates: [{ id, order_no }, ...] }
export const reorderBlocks = async (req, res) => {
  try {
    const { updates } = req.body;
    if (!Array.isArray(updates) || !updates.length)
      return res.status(400).json({ message: "updates array required" });

    await BlockModel.batchReorder(updates);
    return res.json({ message: "Blocks reordered" });
  } catch (err) {
    console.error("reorderBlocks error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ── DELETE /api/topic-blocks/:id ─────────────────────────────────────────────
export const deleteBlock = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid block id" });

    const affected = await BlockModel.deleteBlock(id);
    if (!affected) return res.status(404).json({ message: "Block not found" });
    return res.json({ id, message: "Block deleted" });
  } catch (err) {
    console.error("deleteBlock error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
