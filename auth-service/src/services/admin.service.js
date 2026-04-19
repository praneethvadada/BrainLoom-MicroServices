const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");
const adminRepo    = require("../repositories/admin.repository");
const adminOtpRepo = require("../repositories/adminOtp.repository");
const jwtUtil      = require("../utils/token.util");
const emailService = require("./email.service");
const { generateOTP } = require("../utils/otp.util");

/**
 * Register a new service admin.
 * Protected at route level — only super admin can call this.
 */
exports.register = async (data) => {
  const existing = await adminRepo.findByEmail(data.email);
  if (existing) throw new Error("An admin with this email already exists");

  if (!data.scope) {
    throw new Error(`scope is required. Valid values: ${adminRepo.VALID_SCOPES.join(", ")}`);
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const adminId = await adminRepo.createAdmin({
    name:     data.name,
    email:    data.email,
    password: hashedPassword,
    phone:    data.phone,
    scope:    data.scope,
    is_super: data.is_super ? 1 : 0
  });

  return { message: "Admin registered successfully", adminId, scope: data.scope };
};

/**
 * Admin login — embeds scope + is_super in JWT.
 */
exports.login = async (email, password) => {
  const admin = await adminRepo.findByEmail(email);
  if (!admin) throw new Error("Invalid admin credentials");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error("Invalid admin credentials");

  const accessToken = jwtUtil.generateAdminToken(admin);

  return {
    accessToken,
    adminId:  `admin_${admin.id}`,
    name:     admin.name,
    scope:    admin.scope,
    is_super: admin.is_super === 1
  };
};

/**
 * Forgot password — sends OTP to admin email.
 * Self-service, no auth required.
 */
exports.forgotPassword = async (email) => {
  const admin = await adminRepo.findByEmail(email);
  // Don't reveal whether email exists — always return same message
  if (!admin) return { message: "If that email is registered, an OTP has been sent." };

  const otp     = generateOTP();
  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 10); // 10 min expiry

  // Use the dedicated admin_otps table — no FK constraint to users
  await adminOtpRepo.createOTP({
    id:        uuid(),
    adminId:   admin.id,   // plain INT — no "admin_" prefix needed
    otp,
    expiresAt: expires
  });

  await emailService.sendPasswordResetOTP(admin.email, otp, admin.name);

  return { message: "If that email is registered, an OTP has been sent." };
};

/**
 * Reset password — verify OTP + set new password.
 */
exports.resetPassword = async (email, otp, newPassword) => {
  const admin = await adminRepo.findByEmail(email);
  if (!admin) throw new Error("Invalid request");

  const validOTP = await adminOtpRepo.findValidOTP(admin.id, otp);
  if (!validOTP) throw new Error("Invalid or expired OTP");

  await adminOtpRepo.markVerified(validOTP.id);

  const hashed = await bcrypt.hash(newPassword, 12);
  await adminRepo.updatePassword(admin.id, hashed);

  return { message: "Password reset successfully" };
};

/**
 * List all admins — super admin only.
 */
exports.listAdmins = async () => {
  return await adminRepo.listAdmins();
};

/**
 * Delete an admin — super admin only.
 */
exports.deleteAdmin = async (id) => {
  const admin = await adminRepo.findById(id);
  if (!admin) throw new Error("Admin not found");
  if (admin.is_super) throw new Error("Cannot delete a super admin");
  await adminRepo.deleteAdmin(id);
  return { message: "Admin deleted successfully" };
};

/**
 * Force-reset an admin's password — super admin only, no OTP.
 */
exports.forceResetPassword = async (id, newPassword) => {
  const admin = await adminRepo.findById(id);
  if (!admin) throw new Error("Admin not found");
  const hashed = await bcrypt.hash(newPassword, 12);
  await adminRepo.updatePassword(id, hashed);
  return { message: `Password reset for ${admin.email}` };
};
