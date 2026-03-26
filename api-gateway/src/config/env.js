require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 4000,

  AUTH_SERVICE: process.env.AUTH_SERVICE,
  TUTORIAL_SERVICE: process.env.TUTORIAL_SERVICE,
  PREMIUM_SERVICE: process.env.PREMIUM_SERVICE,
  ANALYTICS_SERVICE: process.env.ANALYTICS_SERVICE,

  RATE_LIMIT_WINDOW: process.env.RATE_LIMIT_WINDOW || 15,
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || 100
};