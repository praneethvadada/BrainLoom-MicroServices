// Admin credentials are stored centrally in auth_db.
// The scope field determines which service each admin manages.
// Do NOT store admin creds in individual service databases.
const authDb = require("../config/db");

// Valid service scopes — add new services here as the platform grows
const VALID_SCOPES = ["tutorial", "cyber", "premium", "analytics", "all"];

exports.VALID_SCOPES = VALID_SCOPES;

exports.findByEmail = async (email) => {
  const [rows] = await authDb.query(
    `SELECT * FROM admins WHERE email = ?`,
    [email]
  );
  return rows[0];
};

exports.findById = async (id) => {
  const [rows] = await authDb.query(
    `SELECT * FROM admins WHERE id = ?`,
    [id]
  );
  return rows[0];
};

/**
 * Creates a new admin.
 * scope: which service this admin manages — "tutorial" | "premium" | "analytics" | "all"
 * is_super: 1 = super admin (can create other admins), 0 = regular service admin
 */
exports.createAdmin = async (admin) => {
  if (!VALID_SCOPES.includes(admin.scope)) {
    throw new Error(`Invalid scope. Must be one of: ${VALID_SCOPES.join(", ")}`);
  }

  const [result] = await authDb.query(
    `INSERT INTO admins (name, email, password, phone, scope, is_super) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      admin.name,
      admin.email,
      admin.password,
      admin.phone || null,
      admin.scope,
      admin.is_super || 0
    ]
  );
  return result.insertId;
};

exports.listAdmins = async () => {
  const [rows] = await authDb.query(
    `SELECT id, name, email, phone, scope, is_super, created_at FROM admins ORDER BY created_at DESC`
  );
  return rows;
};

exports.updatePassword = async (id, hashedPassword) => {
  await authDb.query(
    `UPDATE admins SET password = ? WHERE id = ?`,
    [hashedPassword, id]
  );
};

exports.deleteAdmin = async (id) => {
  await authDb.query(`DELETE FROM admins WHERE id = ?`, [id]);
};
