const bcrypt = require("bcrypt");
const adminRepo = require("../repositories/admin.repository");
const jwtUtil = require("../utils/token.util");
const sessionService = require("./session.service");

exports.register = async (data) => {
  const existing = await adminRepo.findByEmail(data.email);
  if (existing) throw new Error("Email exists for another admin");

  const hashedPassword = await bcrypt.hash(data.password, 12);
  
  const adminId = await adminRepo.createAdmin({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    phone: data.phone,
    is_super: data.is_super ? 1 : 0
  });

  return { message: "Tutorial Admin registered successfully", adminId };
};

exports.login = async (email, password, req) => {
  const admin = await adminRepo.findByEmail(email);
  if (!admin) throw new Error("Invalid admin credentials");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error("Invalid admin credentials");

  // Prefixing the id so gateway internals can resolve it back to tutorial_db
  const prefixedId = `admin_${admin.id}`;

  const accessToken = jwtUtil.generateAccessToken(prefixedId);
  // Bypassing refresh token table session due to strict MySQL FK constraints on the users table.
  // Admins will receive a standalone long-lived accessToken structure.
  return { accessToken };
};
