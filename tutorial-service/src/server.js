// src/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import topicRoutes from "./routes/topicRoutes.js";
import blockRoutes from "./routes/blockRoutes.js";
import mcqRoutes from "./routes/mcqRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import contentBlockRoutes from "./routes/contentBlockRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import topicBlockRoutes from "./routes/topicBlockRoutes.js";  // ← new block system
import mediaRoutes from "./routes/mediaRoutes.js";             // ← S3 image uploads



import * as TopicCtrl from "./controllers/topicController.js";

import { attachUser } from "./middleware/gatewayUser.js";
import { gatewayGuard } from "./middleware/gatewayGuard.js";

dotenv.config();

const app = express();

const JSON_LIMIT = process.env.JSON_LIMIT || "50mb";


// BODY PARSERS
app.use(express.json({ limit: JSON_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: JSON_LIMIT }));


// USER ATTACHED FROM GATEWAY HEADERS
app.use(attachUser);


// CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-user-id",
      "x-user-role",
      "x-user-premium",
      "x-internal-gateway-key"
    ]
  })
);


// STATIC FILES
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


app.get("/health", (req, res) => {

  const healthData = {
    service: "tech-tutorials-service",
    status: "healthy",
    uptime: process.uptime(), // seconds
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    memory: {
      rss: process.memoryUsage().rss,
      heapTotal: process.memoryUsage().heapTotal,
      heapUsed: process.memoryUsage().heapUsed
    }
  };

  res.status(200).json(healthData);
});


// ROOT PATH RESOLVER
const RESERVED_ROOTS = new Set([
  "api",
  "auth",
  "static",
  "assets",
  "admin",
  "health",
  "_env",
  "public"
]);

// 🔐 GATEWAY PROTECTION (IMPORTANT)
// strictly enforce that all requests come through the API Gateway
app.use(gatewayGuard);

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Tech Tutorials API");
});

app.get(/^\/(.*)$/, (req, res, next) => {

  const pathParam = req.params?.[0] || "";

  if (!pathParam) return next();

  const first = pathParam.split("/")[0].toLowerCase();

  if (RESERVED_ROOTS.has(first)) return next();

  return TopicCtrl.resolveByRootPath(req, res, next);
});


// GATEWAY PROTECTION MOVED TO TOP


// ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api", blockRoutes);
app.use("/api/mcqs", mcqRoutes);
app.use("/api", commentRoutes);
app.use("/api/content-blocks", contentBlockRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/topic-blocks", topicBlockRoutes);  // ← new block system
app.use("/api/media",       mediaRoutes);         // ← S3 image uploads




// ERROR HANDLER
app.use((err, req, res, next) => {

  if (err?.type === "entity.too.large") {
    return res.status(413).json({
      message: "Payload too large. Reduce image size or increase server limit."
    });
  }

  console.error("Unhandled error:", err);

  res.status(500).json({
    message: "Server error"
  });

});


// SERVER
const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
