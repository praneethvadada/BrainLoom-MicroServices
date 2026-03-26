const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");

const healthRoutes = require("./routes/health.routes");

const authMiddleware = require("./middlewares/auth.middleware");
const requestLogger = require("./middlewares/requestLogger.middleware");
const rateLimiter = require("./middlewares/rateLimit.middleware");

const authProxy = require("./proxies/auth.proxy");
const tutorialProxy = require("./proxies/tutorial.proxy");
const premiumProxy = require("./proxies/premium.proxy");
const analyticsProxy = require("./proxies/analytics.proxy");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(requestLogger);
app.use(rateLimiter);

// health check
app.use("/health", healthRoutes);

// auth service
// app.use("/auth", authProxy);
app.use("/api/v1/auth", authProxy);
// tutorial service (ONLY ONCE)
app.use("/tutorials", authMiddleware, tutorialProxy);

// premium service
app.use("/premium", authMiddleware, premiumProxy);

// analytics service
app.use("/analytics", authMiddleware, analyticsProxy);

// swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;


// const express = require("express");
// const cors = require("cors");
// const helmet = require("helmet");

// const swaggerUi = require("swagger-ui-express");
// const swaggerSpec = require("./swagger/swagger");

// const healthRoutes = require("./routes/health.routes");

// const authMiddleware = require("./middlewares/auth.middleware");
// const requestLogger = require("./middlewares/requestLogger.middleware");
// const rateLimiter = require("./middlewares/rateLimit.middleware");

// const authProxy = require("./proxies/auth.proxy");
// const tutorialProxy = require("./proxies/tutorial.proxy");
// const premiumProxy = require("./proxies/premium.proxy");
// const analyticsProxy = require("./proxies/analytics.proxy");

// const app = express();

// app.use(helmet());
// app.use(cors());
// app.use(express.json());

// app.use(requestLogger);
// app.use(rateLimiter);

// // health check
// app.use("/health", healthRoutes);

// // auth service
// app.use("/auth", authProxy);

// // tutorial service
// app.use("/tutorials", authMiddleware, tutorialProxy);

// // premium service
// app.use("/premium", authMiddleware, premiumProxy);

// // analytics service
// app.use("/analytics", authMiddleware, analyticsProxy);

// // swagger
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// module.exports = app;



// // const express = require("express");
// // const cors = require("cors");
// // const app = express();
// // const helmet = require("helmet");
// // const swaggerUi = require("swagger-ui-express");
// // const swaggerSpec = require("./swagger/swagger");
// // const healthRoutes = require("./routes/health.routes");
// // const authMiddleware = require("./middlewares/auth.middleware");
// // const requestLogger = require("./middlewares/requestLogger.middleware");
// // const authProxy = require("./proxies/auth.proxy");
// // const tutorialProxy = require("./proxies/tutorial.proxy");
// // const premiumProxy = require("./proxies/premium.proxy");
// // const analyticsProxy = require("./proxies/analytics.proxy");


// // const rateLimiter = require("./middlewares/rateLimit.middleware");
// // app.use(helmet());
// // app.use(cors());

// // app.use(express.json());
// // app.use(requestLogger);
// // app.use(rateLimiter);
// // app.use("/tutorials", authMiddleware, tutorialProxy);
// // app.use("/premium", authMiddleware);
// // app.use("/analytics", authMiddleware);
// // app.use("/health", healthRoutes);

// // app.use("/auth", authProxy);

// // app.use("/tutorials", authMiddleware, tutorialProxy);

// // app.use("/premium", authMiddleware, premiumProxy);

// // app.use("/analytics", authMiddleware, analyticsProxy);


// // app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// // module.exports = app;