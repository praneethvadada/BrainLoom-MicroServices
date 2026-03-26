const { v4: uuid } = require("uuid");
const sessionRepo = require("../repositories/session.repository");

exports.createUserSession = async (userId, refreshToken, req) => {

  const expires = new Date();
  expires.setDate(
    expires.getDate() + parseInt(process.env.REFRESH_EXPIRES_DAYS)
  );

  await sessionRepo.createSession({
    id: uuid(),
    user_id: userId,
    refresh_token: refreshToken,
    device_info: req.headers["user-agent"] || "unknown",
    ip_address: req.ip,
    expires_at: expires
  });
};