// 📄 auth-service/src/middlewares/requireSuperAdmin.js
//
// Middleware that only allows requests from a logged-in super admin.
// Used to protect the /admin/register route so only a super admin
// can create new service admins.

const jwt = require("jsonwebtoken");
const { publicKey } = require("../config/jwt");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });

    // Must be an admin token (sub prefixed with "admin_")
    if (!decoded.sub || !decoded.sub.startsWith("admin_")) {
      return res.status(403).json({ message: "Forbidden: admin access required" });
    }

    // Must be a super admin
    if (!decoded.is_super) {
      return res.status(403).json({
        message: "Forbidden: only a super admin can create new admins"
      });
    }

    req.adminClaims = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
