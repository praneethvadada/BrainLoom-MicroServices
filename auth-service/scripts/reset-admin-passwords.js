/**
 * Reset admin passwords to known values.
 * Run from auth-service directory: node scripts/reset-admin-passwords.js
 */
require("dotenv").config();
const bcrypt = require("bcrypt");
const mysql  = require("mysql2/promise");

const RESET = [
  { email: "ceo@brainloom.in",           newPassword: "SuperAdmin@123",   label: "Super Admin" },
  { email: "praneethvadada24@gmail.com",  newPassword: "TutorialAdmin@123", label: "Tutorial Admin" },
];

(async () => {
  const db = await mysql.createConnection({
    host:     process.env.DB_HOST     || "localhost",
    user:     process.env.DB_USER     || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME     || "brainloom_auth_db",
  });

  console.log("\n── Current admin accounts ────────────────────────────────");
  const [rows] = await db.query(
    "SELECT id, name, email, scope, is_super FROM admins ORDER BY id"
  );
  console.table(rows);

  console.log("\n── Resetting passwords ────────────────────────────────────");
  for (const { email, newPassword, label } of RESET) {
    const hash = await bcrypt.hash(newPassword, 12);
    const [result] = await db.query(
      "UPDATE admins SET password = ? WHERE email = ?",
      [hash, email]
    );
    if (result.affectedRows > 0) {
      console.log(`✅  ${label} (${email}) → password reset to: ${newPassword}`);
    } else {
      console.log(`⚠️  ${label} (${email}) → NOT FOUND in DB`);
    }
  }

  console.log("\n── Done. Use these credentials to log in ──────────────────");
  console.log("  Super Admin:    ceo@brainloom.in          /  SuperAdmin@123");
  console.log("  Tutorial Admin: praneethvadada24@gmail.com / TutorialAdmin@123");
  console.log("─────────────────────────────────────────────────────────────\n");

  await db.end();
})();
