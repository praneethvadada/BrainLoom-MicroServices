const env = require("./env");

module.exports = {
  auth: env.AUTH_SERVICE,
  tutorial: env.TUTORIAL_SERVICE,
  premium: env.PREMIUM_SERVICE,
  analytics: env.ANALYTICS_SERVICE
};