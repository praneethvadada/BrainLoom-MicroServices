const { createProxyMiddleware } = require("http-proxy-middleware");
const services = require("../config/services");

module.exports = createProxyMiddleware({
  target: services.tutorial,
  changeOrigin: true,

  pathRewrite: {
    "^/api/v1/topics": "/api/topics"
  },

  on: {
    proxyReq: (proxyReq, req) => {
      const gatewayKey = process.env.INTERNAL_GATEWAY_KEY;

      // ── Internal gateway key ───────────────────────────────────────────
      proxyReq.setHeader("x-internal-gateway-key", gatewayKey);

      // ── User identity headers (set by optionalAuthMiddleware) ──────────
      if (req.headers["x-user-id"])      proxyReq.setHeader("x-user-id",      req.headers["x-user-id"]);
      if (req.headers["x-user-role"])    proxyReq.setHeader("x-user-role",    req.headers["x-user-role"]);
      if (req.headers["x-user-premium"]) proxyReq.setHeader("x-user-premium", req.headers["x-user-premium"]);
      if (req.headers["x-user-scope"])   proxyReq.setHeader("x-user-scope",   req.headers["x-user-scope"]);
      if (req.headers["x-user-super"])   proxyReq.setHeader("x-user-super",   req.headers["x-user-super"]);

      // ── Re-write request body ──────────────────────────────────────────
      // express.json() already parsed and consumed the raw stream.
      // The proxy must manually re-serialize and write the body, otherwise
      // POST/PUT requests hang — the downstream service waits for bytes
      // that never arrive.
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type",   "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  }
});
