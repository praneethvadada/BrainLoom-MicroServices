const rateLimit = require("express-rate-limit");
const env = require("../config/env");

const LOCALHOST = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW * 60 * 1000,
  max: env.RATE_LIMIT_MAX,

  // ── Skip rate limiting for localhost (dev seeding, scripts, etc.) ──────────
  skip: (req) => {
    const ip = req.ip || req.socket?.remoteAddress || "";
    return LOCALHOST.has(ip);
  },

  message: {
    message: "Too many requests. Please try again later."
  }
});

module.exports = limiter;