const jwt = require("jsonwebtoken");
const { publicKey } = require("../config/jwt");
const authService = require("../services/auth.service");

module.exports = async (req, res, next) => {
  console.log("Authorization header:", req.headers.authorization);
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"]
    });
    console.log("Decoded JWT:", decoded);

    const userId = decoded.sub;

    const claims = await authService.getUserClaims(userId);

    if (claims.is_deleted) {
      return res.status(403).json({
        message: "Account deleted"
      });
    }
    
    req.headers["x-user-id"] = claims.id;
    req.headers["x-user-role"] = claims.role;
    req.headers["x-user-premium"] = claims.is_premium;


    console.log("Gateway attaching headers:", {
  userId: req.headers["x-user-id"],
  role: req.headers["x-user-role"],
  premium: req.headers["x-user-premium"]
});

    next();

  } catch (error) {
    console.log("JWT verification failed:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token"
      
    });
  }
};