const jwt = require("jsonwebtoken");
const { privateKey } = require("../config/jwt");

exports.generateAccessToken = (userId) => {
  return jwt.sign(
    {
      sub: userId,
      type: "access"
    },
    privateKey,
    {
      algorithm: "RS256",
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
};
exports.generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      sub: userId,
      type: "refresh"
    },
    privateKey,
    {
      algorithm: "RS256",
      expiresIn: `${process.env.REFRESH_EXPIRES_DAYS}d`
    }
  );
};