// api-gateway/src/proxies/blocks.proxy.js
// Proxies /api/v1/topic-blocks/* → tutorial service /api/topic-blocks/*
const { createProxyMiddleware } = require("http-proxy-middleware");
const services = require("../config/services");

module.exports = createProxyMiddleware({
  target: services.tutorial,
  changeOrigin: true,

  pathRewrite: {
    "^/api/v1/topic-blocks": "/api/topic-blocks"
  },

  on: {
    proxyReq: (proxyReq, req) => {
      proxyReq.setHeader("x-internal-gateway-key", process.env.INTERNAL_GATEWAY_KEY);

      if (req.headers["x-user-id"])      proxyReq.setHeader("x-user-id",      req.headers["x-user-id"]);
      if (req.headers["x-user-role"])    proxyReq.setHeader("x-user-role",    req.headers["x-user-role"]);
      if (req.headers["x-user-premium"]) proxyReq.setHeader("x-user-premium", req.headers["x-user-premium"]);
      if (req.headers["x-user-scope"])   proxyReq.setHeader("x-user-scope",   req.headers["x-user-scope"]);
      if (req.headers["x-user-super"])   proxyReq.setHeader("x-user-super",   req.headers["x-user-super"]);

      // Re-serialize body (express.json() consumed the stream)
      if (req.body && Object.keys(req.body).length > 0) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type",   "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  }
});
