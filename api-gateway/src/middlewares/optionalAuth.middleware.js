const jwt = require("jsonwebtoken");
const { publicKey } = require("../config/jwt");
const authService = require("../services/auth.service");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      // Optional auth: no token means proceed as guest
      return next();
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"]
    });

    const userId = decoded.sub;

    const claims = await authService.getUserClaims(userId);

    if (claims && !claims.is_deleted) {
      req.headers["x-user-id"]      = claims.id;
      req.headers["x-user-role"]    = claims.role;
      req.headers["x-user-premium"] = claims.is_premium;
      req.headers["x-user-scope"]   = claims.scope || "";
      req.headers["x-user-super"]   = claims.is_super ? "true" : "false";
    }

    next();

  } catch (error) {
    // If token is present but invalid, still proceed as guest (or we could fail, but optional means try it)
    console.log("Optional auth - JWT verification failed:", error.message);
    next();
  }
};
