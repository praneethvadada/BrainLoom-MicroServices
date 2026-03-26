const pool = require("../config/db");

exports.findByEmail = async (email) => {
  const [rows] = await pool.query(
    `SELECT * FROM users 
     WHERE email = ? AND is_deleted = FALSE`,
    [email]
  );
  return rows[0];
};

exports.findByUsername = async (username) => {
  const [rows] = await pool.query(
    `SELECT * FROM users 
     WHERE username = ? AND is_deleted = FALSE`,
    [username]
  );
  return rows[0];
};

exports.findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT * FROM users WHERE id = ?`,
    [id]
  );
  return rows[0];
};

exports.createUser = async (user) => {
  await pool.query(
    `INSERT INTO users 
     (id, email, username, password, name, country, preferred_language, auth_type)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.id,
      user.email,
      user.username,
      user.password,
      user.name,
      user.country,
      user.preferred_language,
      "local"
    ]
  );
};

exports.markEmailVerified = async (userId) => {
  await pool.query(
    `UPDATE users SET email_verified = TRUE WHERE id = ?`,
    [userId]
  );
};

exports.softDeleteUser = async (userId) => {
  await pool.query(
    `UPDATE users SET is_deleted = TRUE WHERE id = ?`,
    [userId]
  );
};