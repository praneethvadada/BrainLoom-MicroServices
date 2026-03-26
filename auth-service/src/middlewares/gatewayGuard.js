module.exports = (req, res, next) => {

  const gatewayKey = req.headers["x-internal-gateway-key"];

  if (!gatewayKey || gatewayKey !== process.env.INTERNAL_GATEWAY_KEY) {
    return res.status(403).json({
      message: "Direct service access forbidden"
    });
  }

  next();
};