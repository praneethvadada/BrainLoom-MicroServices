// src/routes/topicRoutes.js
import express from "express";
import * as TopicCtrl from "../controllers/topicController.js";
// import { authenticate } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/roleMiddleware.js";
import * as TopicContentCtrl from "../controllers/topicContentController.js";

const router = express.Router();

function ensureFn(fn, name) {
  if (typeof fn === "function") return fn;
  return (req, res) => res.status(500).json({ message: `${name} is not a function` });
}

const safeCreate = ensureFn(TopicCtrl.createTopic, "createTopic");
const safeEdit = ensureFn(TopicCtrl.editTopic, "editTopic");
const safeDelete = ensureFn(TopicCtrl.deleteTopic, "deleteTopic");
const safeGetById = ensureFn(TopicCtrl.getTopicById, "getTopicById");
const safeGetChildren = ensureFn(TopicCtrl.getChildren, "getChildren");
const safeGetBySlug = ensureFn(TopicCtrl.getTopicBySlugPath, "getTopicBySlugPath");
const safeGetTree = ensureFn(TopicCtrl.getTopicTree, "getTopicTree");
const safeCheckSlug = ensureFn(TopicCtrl.checkSlugAvailabilityController, "checkSlugAvailabilityController");
router.get("/", TopicCtrl.getRootTopics);

// slug check (must come before /:id)
router.get("/slug-check", safeCheckSlug);



// dedicated root topics endpoint
router.get("/root", TopicCtrl.getRootTopics);

// Create
router.post("/add",  requireAdmin, safeCreate);

// Update / Delete
router.put("/:id",  requireAdmin, safeEdit);
router.delete("/:id",  requireAdmin, safeDelete);

// Get by ID (includes blocks & immediate children)
router.get("/:id", safeGetById);

// list children (use "null" for top-level)
router.get("/children/:id", safeGetChildren);

// recursive tree
router.get("/tree/:id", safeGetTree);

// slug resolver (API): use regex to capture everything after /slug/
router.get(/^\/slug\/(.*)$/, safeGetBySlug);

// Add content by topic id (protected)
router.post("/:id/content",  requireAdmin, TopicContentCtrl.addContentByTopicId);

// Add content by slug wildcard (protected) — use regex to capture arbitrary path after /slug/
router.post(/^\/slug\/(.*)\/content$/,  requireAdmin, TopicContentCtrl.addContentBySlug);

router.post("/:parentId/reorder",  requireAdmin, TopicCtrl.bulkReorderHandler);

export default router;
