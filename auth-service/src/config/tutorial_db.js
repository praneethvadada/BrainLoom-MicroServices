const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "host.docker.internal",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.TUTORIAL_DB_NAME || "tutorial_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
