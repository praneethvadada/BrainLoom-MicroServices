// src/models/topicBlockModel.js — clean model for new content_blocks schema
// Schema: id, topic_id, type, order_no (FLOAT), data (JSON), is_published
import db from "../config/db.js";

// ── Helpers ──────────────────────────────────────────────────────────────────
function safeParse(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === "object") return val;
  try { return JSON.parse(val); } catch { return val; }
}

function formatBlock(r) {
  return {
    id:           r.id,
    topic_id:     r.topic_id,
    type:         r.type,
    order_no:     r.order_no,
    data:         safeParse(r.data),
    is_published: r.is_published,
    created_at:   r.created_at,
    updated_at:   r.updated_at,
  };
}

// ── Queries ───────────────────────────────────────────────────────────────────

/** Get all published blocks for a topic, ordered */
export const getBlocksByTopic = async (topic_id, includeUnpublished = false) => {
  const sql = includeUnpublished
    ? `SELECT * FROM content_blocks WHERE topic_id = ? ORDER BY order_no ASC, created_at ASC`
    : `SELECT * FROM content_blocks WHERE topic_id = ? AND is_published = 1 ORDER BY order_no ASC, created_at ASC`;
  const [rows] = await db.query(sql, [topic_id]);
  return rows.map(formatBlock);
};

/** Get single block by id */
export const getBlockById = async (id) => {
  const [rows] = await db.query(`SELECT * FROM content_blocks WHERE id = ? LIMIT 1`, [id]);
  return rows.length ? formatBlock(rows[0]) : null;
};

/**
 * Create a new block.
 * @param {number} topic_id
 * @param {string} type  — heading|paragraph|code|code_tabs|image|carousel|note|example|link_block|divider
 * @param {object} data  — type-specific payload
 * @param {number} order_no — FLOAT allows inserting between (e.g. 2.5 between 2 and 3)
 */
export const createBlock = async ({ topic_id, type, data, order_no = 0, is_published = 1 }) => {
  const [res] = await db.query(
    `INSERT INTO content_blocks (topic_id, type, order_no, data, is_published)
     VALUES (?, ?, ?, ?, ?)`,
    [topic_id, type, order_no, JSON.stringify(data), is_published]
  );
  return res.insertId;
};

/**
 * Update a block's data and/or order_no.
 */
export const updateBlock = async (id, { data, order_no, type, is_published }) => {
  const parts = [];
  const vals  = [];

  if (data         !== undefined) { parts.push("data = ?");         vals.push(JSON.stringify(data)); }
  if (order_no     !== undefined) { parts.push("order_no = ?");     vals.push(Number(order_no)); }
  if (type         !== undefined) { parts.push("type = ?");         vals.push(type); }
  if (is_published !== undefined) { parts.push("is_published = ?"); vals.push(is_published ? 1 : 0); }

  if (!parts.length) return 0;
  vals.push(id);

  const [res] = await db.query(
    `UPDATE content_blocks SET ${parts.join(", ")}, updated_at = NOW() WHERE id = ?`,
    vals
  );
  return res.affectedRows;
};

/**
 * Batch reorder: accepts array of { id, order_no } and updates each row.
 * Used when admin drags and drops multiple blocks.
 */
export const batchReorder = async (updates) => {
  // updates: [{ id, order_no }, ...]
  const promises = updates.map(u =>
    db.query(`UPDATE content_blocks SET order_no = ? WHERE id = ?`, [u.order_no, u.id])
  );
  await Promise.all(promises);
};

/** Delete a block */
export const deleteBlock = async (id) => {
  const [res] = await db.query(`DELETE FROM content_blocks WHERE id = ?`, [id]);
  return res.affectedRows;
};

/** Get max order_no for a topic (useful when appending a new block at the end) */
export const getMaxOrder = async (topic_id) => {
  const [rows] = await db.query(
    `SELECT MAX(order_no) as max_order FROM content_blocks WHERE topic_id = ?`,
    [topic_id]
  );
  return rows[0]?.max_order ?? 0;
};
