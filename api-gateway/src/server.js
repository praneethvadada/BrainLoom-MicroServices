const app = require("./app");
const env = require("./config/env");
const logger = require("./utils/logger");

app.listen(env.PORT, () => {
  logger.info(`API Gateway running on port ${env.PORT}`);
});