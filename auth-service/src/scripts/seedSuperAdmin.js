/**
 * 📄 auth-service/src/scripts/seedSuperAdmin.js
 *
 * One-time script to create the very first super admin.
 * Run this manually on your server ONCE after first deployment.
 *
 * Usage:
 *   cd auth-service
 *   node src/scripts/seedSuperAdmin.js
 *
 * After this super admin is created:
 *   - Log in at POST /api/v1/auth/admin/login
 *   - Use the returned accessToken to call POST /api/v1/auth/admin/register
 *     to create per-service admins (tutorial, premium, analytics, etc.)
 *
 * ⚠️  Run this ONLY ONCE. Running it again with the same email will fail.
 */

require("dotenv").config();
const bcrypt = require("bcrypt");
const authDb = require("../config/db");

const SUPER_ADMIN = {
  name: "Super Admin",
  email: process.env.SUPER_ADMIN_EMAIL || "praneethvadada24@gmail.com",
  password: process.env.SUPER_ADMIN_PASSWORD || "Praneeth123@",
  phone: null,
  scope: "all",      // "all" scope = can manage every service
  is_super: 1
};

async function seed() {
  console.log("🌱 Seeding super admin...");
  console.log(`   Email : ${SUPER_ADMIN.email}`);
  console.log(`   Scope : ${SUPER_ADMIN.scope}`);

  try {
    // Check if already exists
    const [existing] = await authDb.query(
      "SELECT id FROM admins WHERE email = ?",
      [SUPER_ADMIN.email]
    );

    if (existing.length > 0) {
      console.log("⚠️  Super admin already exists with this email. Skipping.");
      process.exit(0);
    }

    const hashed = await bcrypt.hash(SUPER_ADMIN.password, 12);

    const [result] = await authDb.query(
      `INSERT INTO admins (name, email, password, phone, scope, is_super) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        SUPER_ADMIN.name,
        SUPER_ADMIN.email,
        hashed,
        SUPER_ADMIN.phone,
        SUPER_ADMIN.scope,
        SUPER_ADMIN.is_super
      ]
    );

    console.log(`✅ Super admin created! ID: ${result.insertId}`);
    console.log("");
    console.log("Next steps:");
    console.log("  1. Login at POST /api/v1/auth/admin/login");
    console.log("  2. Use the token to call POST /api/v1/auth/admin/register");
    console.log("     to create service-specific admins.");
    console.log("");
    console.log("⚠️  IMPORTANT: Change the default password if you used it!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
