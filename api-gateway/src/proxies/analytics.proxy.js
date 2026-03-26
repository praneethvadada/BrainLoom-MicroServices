const { createProxyMiddleware } = require("http-proxy-middleware");
const services = require("../config/services");

module.exports = createProxyMiddleware({
  target: services.analytics,
  changeOrigin: true
});