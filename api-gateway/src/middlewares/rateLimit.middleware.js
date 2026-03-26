const rateLimit = require("express-rate-limit");
const env = require("../config/env");

const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW * 60 * 1000,
  max: env.RATE_LIMIT_MAX,
  message: {
    message: "Too many requests. Please try again later."
  }
});

module.exports = limiter;