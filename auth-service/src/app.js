const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { swaggerUi, specs } = require("./swagger/swagger");

const authRoutes = require("./routes/auth.routes");
const internalRoutes = require("./routes/internal.routes");
const oauthRoutes = require("./routes/oauth.routes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const gatewayGuard = require("./middlewares/gatewayGuard");

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Enforce that all subsequent routes come through the API Gateway
app.use(gatewayGuard);

app.use("/api/v1/auth", authRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/internal", internalRoutes);
app.use("/api/v1/oauth", oauthRoutes);
app.use("/internal", internalRoutes);
// health route moved to the top

module.exports = app;


