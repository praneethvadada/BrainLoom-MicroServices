const pool = require("../config/db");

exports.findByProvider = async (provider, providerId) => {
  const [rows] = await pool.query(
    `SELECT * FROM oauth_accounts 
     WHERE provider = ? AND provider_id = ?`,
    [provider, providerId]
  );
  return rows[0];
};

exports.findByUserId = async (userId) => {
  const [rows] = await pool.query(
    `SELECT * FROM oauth_accounts 
     WHERE user_id = ?`,
    [userId]
  );
  return rows;
};

exports.createOAuthAccount = async (data) => {
  await pool.query(
    `INSERT INTO oauth_accounts 
     (id, user_id, provider, provider_id)
     VALUES (?, ?, ?, ?)`,
    [
      data.id,
      data.user_id,
      data.provider,
      data.provider_id
    ]
  );
};