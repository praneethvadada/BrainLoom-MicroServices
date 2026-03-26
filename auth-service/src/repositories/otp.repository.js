const pool = require("../config/db");

exports.createOTP = async (otpData) => {
  await pool.query(
    `INSERT INTO email_otps (id, user_id, otp, expires_at)
     VALUES (?, ?, ?, ?)`,
    [
      otpData.id,
      otpData.user_id,
      otpData.otp,
      otpData.expires_at
    ]
  );
};

exports.findValidOTP = async (userId, otp) => {
  const [rows] = await pool.query(
    `SELECT * FROM email_otps 
     WHERE user_id = ? 
     AND otp = ? 
     AND verified = FALSE 
     AND expires_at > NOW()`,
    [userId, otp]
  );

  return rows[0];
};

exports.markOTPVerified = async (otpId) => {
  await pool.query(
    `UPDATE email_otps SET verified = TRUE WHERE id = ?`,
    [otpId]
  );
};


exports.deleteExpiredOTPs = async () => {
  await pool.query(
    `DELETE FROM email_otps WHERE expires_at < NOW()`
  );
};
