const pool = require("../config/db");

exports.createSession = async (session) => {
  await pool.query(
    `INSERT INTO sessions 
     (id, user_id, refresh_token, device_info, ip_address, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      session.id,
      session.user_id,
      session.refresh_token,
      session.device_info,
      session.ip_address,
      session.expires_at
    ]
  );
};

exports.findSessionByRefreshToken = async (refreshToken) => {
  const [rows] = await pool.query(
    `SELECT * FROM sessions 
     WHERE refresh_token = ? 
     AND expires_at > NOW()`,
    [refreshToken]
  );
  return rows[0];
};

exports.deleteSessionByRefreshToken = async (refreshToken) => {
  await pool.query(
    `DELETE FROM sessions WHERE refresh_token = ?`,
    [refreshToken]
  );
};

exports.deleteAllUserSessions = async (userId) => {
  await pool.query(
    `DELETE FROM sessions WHERE user_id = ?`,
    [userId]
  );
};