const tutorialDb = require("../config/tutorial_db");

exports.findByEmail = async (email) => {
  const [rows] = await tutorialDb.query(`SELECT * FROM admins WHERE email = ?`, [email]);
  return rows[0];
};

exports.findById = async (id) => {
  const [rows] = await tutorialDb.query(`SELECT * FROM admins WHERE id = ?`, [id]);
  return rows[0];
};

exports.createAdmin = async (admin) => {
  const [result] = await tutorialDb.query(
    `INSERT INTO admins (name, email, password, phone, is_super) VALUES (?, ?, ?, ?, ?)`,
    [admin.name, admin.email, admin.password, admin.phone || null, admin.is_super || 0]
  );
  return result.insertId;
};
