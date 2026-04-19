// 📄 auth-service/src/repositories/adminOtp.repository.js
//
// Admin OTPs are stored in their OWN table — no FK to users table.
// This avoids the constraint failure that occurs when using email_otps
// (which enforces user_id → users.id FK).

const authDb = require("../config/db");

exports.createOTP = async ({ id, adminId, otp, expiresAt }) => {
  await authDb.query(
    `INSERT INTO admin_otps (id, admin_id, otp, expires_at) VALUES (?, ?, ?, ?)`,
    [id, adminId, otp, expiresAt]
  );
};

exports.findValidOTP = async (adminId, otp) => {
  const [rows] = await authDb.query(
    `SELECT * FROM admin_otps
     WHERE admin_id  = ?
       AND otp       = ?
       AND verified  = 0
       AND expires_at > NOW()
     LIMIT 1`,
    [adminId, otp]
  );
  return rows[0];
};

exports.markVerified = async (id) => {
  await authDb.query(
    `UPDATE admin_otps SET verified = 1 WHERE id = ?`,
    [id]
  );
};

exports.deleteExpired = async () => {
  await authDb.query(`DELETE FROM admin_otps WHERE expires_at < NOW()`);
};
