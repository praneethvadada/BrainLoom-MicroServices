const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");

const userRepo = require("../repositories/user.repository");
const otpService = require("./otp.service");
const { generateUsername } = require("../utils/username.util");


const jwtUtil = require("../utils/token.util");
const sessionService = require("./session.service");

exports.login = async (identifier, password, req) => {

  let user;

  // Check if email or username
  if (identifier.includes("@")) {
    user = await userRepo.findByEmail(identifier);
  } else {
    user = await userRepo.findByUsername(identifier);
  }

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (user.is_deleted) {
    throw new Error("Account is deleted");
  }

  if (user.auth_type === "oauth") {
    throw new Error("Account exists with OAuth login. Please login using provider.");
  }

  if (!user.email_verified) {
    throw new Error("Please verify your email first.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = jwtUtil.generateAccessToken(user.id);
  const refreshToken = jwtUtil.generateRefreshToken(user.id);

  await sessionService.createUserSession(user.id, refreshToken, req);

  return {
    accessToken,
    refreshToken
  };
};


exports.register = async (data) => {

  const existingUser = await userRepo.findByEmail(data.email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = {
    id: uuid(),
    email: data.email,
    username: generateUsername(data.email),
    password: hashedPassword,
    name: data.name,
    country: data.country,
    preferred_language: data.preferred_language
  };

  await userRepo.createUser(user);

  await otpService.generateAndStoreOTP(user.id);

  return {
    message: "User registered successfully. Please verify OTP."
  };
};


exports.refreshToken = async (refreshToken) => {
  const decoded = require("jsonwebtoken").verify(
    refreshToken,
    require("../config/jwt").publicKey,
    { algorithms: ["RS256"] }
  );

  if (decoded.type !== "refresh") {
    throw new Error("Invalid token type");
  }

  const user = await userRepo.findById(decoded.sub);

  if (!user || user.is_deleted) {
    throw new Error("Account not active");
  }

  const session = await require("../repositories/session.repository")
    .findSessionByRefreshToken(refreshToken);

  if (!session) {
    throw new Error("Session not found or expired");
  }

  const newAccessToken = require("../utils/token.util")
    .generateAccessToken(decoded.sub);

  return { accessToken: newAccessToken };
};

exports.logoutDevice = async (refreshToken) => {
  await require("../repositories/session.repository")
    .deleteSessionByRefreshToken(refreshToken);

  return { message: "Logged out from device" };
};

exports.logoutAll = async (userId) => {
  await require("../repositories/session.repository")
    .deleteAllUserSessions(userId);

  return { message: "Logged out from all devices" };
};

exports.deleteAccount = async (userId) => {

  await require("../repositories/user.repository")
    .softDeleteUser(userId);

  await require("../repositories/session.repository")
    .deleteAllUserSessions(userId);

  return { message: "Account deleted successfully" };
};