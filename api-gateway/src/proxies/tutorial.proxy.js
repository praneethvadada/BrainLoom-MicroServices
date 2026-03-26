const { createProxyMiddleware } = require("http-proxy-middleware");
const services = require("../config/services");

module.exports = createProxyMiddleware({
  target: services.tutorial,
  changeOrigin: true,

  pathRewrite: {
    "^/tutorials": ""
  },

  on: {
    proxyReq: (proxyReq, req) => {

      const gatewayKey = process.env.INTERNAL_GATEWAY_KEY;

      proxyReq.setHeader("x-internal-gateway-key", gatewayKey);

      if (req.headers["x-user-id"]) {
        proxyReq.setHeader("x-user-id", req.headers["x-user-id"]);
      }

      if (req.headers["x-user-role"]) {
        proxyReq.setHeader("x-user-role", req.headers["x-user-role"]);
      }

      if (req.headers["x-user-premium"]) {
        proxyReq.setHeader("x-user-premium", req.headers["x-user-premium"]);
      }

      console.log("Proxy forwarding headers:", {
        gatewayKey,
        userId: req.headers["x-user-id"],
        role: req.headers["x-user-role"]
      });
    }
  }
});


// const { createProxyMiddleware } = require("http-proxy-middleware");
// const services = require("../config/services");

// module.exports = createProxyMiddleware({
//   target: services.tutorial,
//   changeOrigin: true,

//   pathRewrite: {
//     "^/tutorials": ""
//   },

//   onProxyReq: (proxyReq, req) => {
//     const gatewayKey = process.env.INTERNAL_GATEWAY_KEY;

//     proxyReq.setHeader("x-internal-gateway-key", gatewayKey);

//     if (req.headers["x-user-id"]) {
//       proxyReq.setHeader("x-user-id", req.headers["x-user-id"]);
//     }

//     if (req.headers["x-user-role"]) {
//       proxyReq.setHeader("x-user-role", req.headers["x-user-role"]);
//     }

//     if (req.headers["x-user-premium"]) {
//       proxyReq.setHeader("x-user-premium", req.headers["x-user-premium"]);
//     }

//     console.log("Proxy forwarding:", {
//       gatewayKey,
//       userId: req.headers["x-user-id"],
//       role: req.headers["x-user-role"]
//     });
//   }
// });


// // const { createProxyMiddleware } = require("http-proxy-middleware");
// // const services = require("../config/services");

// // module.exports = createProxyMiddleware({
// //   target: services.tutorial,
// //   changeOrigin: true,

// //   pathRewrite: {
// //     "^/tutorials": ""
// //   },

// //   onProxyReq: (proxyReq, req) => {

// //     // forward gateway internal key
// //     proxyReq.setHeader(
// //       "x-internal-gateway-key",
// //       process.env.INTERNAL_GATEWAY_KEY
// //     );

// //     // forward user identity headers
// //     if (req.headers["x-user-id"]) {
// //       proxyReq.setHeader("x-user-id", req.headers["x-user-id"]);
// //     }

// //     if (req.headers["x-user-role"]) {
// //       proxyReq.setHeader("x-user-role", req.headers["x-user-role"]);
// //     }

// //     if (req.headers["x-user-premium"]) {
// //       proxyReq.setHeader("x-user-premium", req.headers["x-user-premium"]);
// //     }

// //     console.log("Proxy forwarding headers:", {
// //       gateway: process.env.INTERNAL_GATEWAY_KEY,
// //       userId: req.headers["x-user-id"],
// //       role: req.headers["x-user-role"]
// //     });
// //   }
// // });


// // // const { createProxyMiddleware } = require("http-proxy-middleware");
// // // const services = require("../config/services");

// // // module.exports = createProxyMiddleware({
// // //   target: services.tutorial,
// // //   changeOrigin: true,

// // //   onProxyReq: (proxyReq, req) => {

// // //     proxyReq.setHeader(
// // //       "x-internal-gateway-key",
// // //       process.env.INTERNAL_GATEWAY_KEY
// // //     );

// // //     proxyReq.setHeader("x-user-id", req.headers["x-user-id"]);
// // //     proxyReq.setHeader("x-user-role", req.headers["x-user-role"]);
// // //     proxyReq.setHeader("x-user-premium", req.headers["x-user-premium"]);
// // //   }
// // // });

// // // // const { createProxyMiddleware } = require("http-proxy-middleware");
// // // // const services = require("../config/services");

// // // // module.exports = createProxyMiddleware({
// // // //   target: services.tutorial,
// // // //   changeOrigin: true,

// // // //   onProxyReq: (proxyReq, req) => {

// // // //     // internal gateway protection
// // // //     proxyReq.setHeader(
// // // //       "x-internal-gateway-key",
// // // //       process.env.INTERNAL_GATEWAY_KEY
// // // //     );

// // // //     // forward authenticated user info
// // // //     proxyReq.setHeader("x-user-id", req.headers["x-user-id"]);
// // // //     proxyReq.setHeader("x-user-role", req.headers["x-user-role"]);
// // // //     proxyReq.setHeader("x-user-premium", req.headers["x-user-premium"]);
// // // //   }
// // // // });