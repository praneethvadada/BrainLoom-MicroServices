require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 4001;

const server = app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server closed gracefully");
    process.exit(0);
  });
});
