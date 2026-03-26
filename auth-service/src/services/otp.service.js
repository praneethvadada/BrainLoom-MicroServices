const { v4: uuid } = require("uuid");
const otpRepo = require("../repositories/otp.repository");
const { generateOTP } = require("../utils/otp.util");
const userRepo = require("../repositories/user.repository");

exports.verifyOTP = async (email, otp) => {
  const user = await userRepo.findByEmail(email);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.email_verified) {
    throw new Error("Email already verified");
  }

  const validOTP = await otpRepo.findValidOTP(user.id, otp);

  if (!validOTP) {
    throw new Error("Invalid or expired OTP");
  }

  await otpRepo.markOTPVerified(validOTP.id);
  await userRepo.markEmailVerified(user.id);

  return { message: "Email verified successfully" };
};
exports.generateAndStoreOTP = async (userId) => {
  const otp = generateOTP();

  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 10); // 10 mins expiry

  await otpRepo.createOTP({
    id: uuid(),
    user_id: userId,
    otp,
    expires_at: expires
  });

  // In production: send email here
  console.log("OTP:", otp);

  return otp;
};
