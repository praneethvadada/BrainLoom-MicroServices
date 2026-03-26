const express = require("express");

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Gateway health check
 *     tags: [Gateway]
 *     responses:
 *       200:
 *         description: Gateway is healthy
 */
router.get("/", (req, res) => {
  res.json({
    service: "API Gateway",
    status: "healthy"
  });
});

module.exports = router;