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

/**
 * Generates an admin access token with scope and is_super embedded.
 * scope  — the service this admin manages, e.g. "tutorial" | "premium" | "all"
 * is_super — 1 means super admin who can manage all services and create other admins
 */
exports.generateAdminToken = (admin) => {
  const prefixedId = `admin_${admin.id}`;
  return jwt.sign(
    {
      sub: prefixedId,
      type: "access",
      scope: admin.scope || "tutorial",
      is_super: admin.is_super ? true : false
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