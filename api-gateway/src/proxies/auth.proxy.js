const { createProxyMiddleware } = require("http-proxy-middleware");
const services = require("../config/services");

module.exports = createProxyMiddleware({
  target: services.auth,
  changeOrigin: true,

  pathRewrite: (path) => {
    return "/api/v1/auth" + path.replace("/api/v1/auth", "");
  },

  on: {
    proxyReq: (proxyReq, req) => {

      // attach internal gateway key
      proxyReq.setHeader(
        "x-internal-gateway-key",
        process.env.INTERNAL_GATEWAY_KEY
      );

      // forward body
      if (req.body && Object.keys(req.body).length) {
        const bodyData = JSON.stringify(req.body);

        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));

        proxyReq.write(bodyData);
      }

      console.log("Gateway → Auth Service", req.method, req.originalUrl);
    }
  }
});

// const { createProxyMiddleware } = require("http-proxy-middleware");

// module.exports = createProxyMiddleware({
//   target: "http://localhost:4001",
//   changeOrigin: true,
//   logLevel: "debug",

//   pathRewrite: (path, req) => {
//     return "/api/v1/auth" + path;
//   },

//   on: {
//     proxyReq: (proxyReq, req) => {
//       console.log("Proxying auth request →", req.method, req.originalUrl);

//       if (req.body && Object.keys(req.body).length) {
//         const bodyData = JSON.stringify(req.body);

//         proxyReq.setHeader("Content-Type", "application/json");
//         proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));

//         proxyReq.write(bodyData);
//       }
//     }
//   }
// });


// // const { createProxyMiddleware } = require("http-proxy-middleware");

// // module.exports = createProxyMiddleware({
// //   target: "http://localhost:4001",
// //   changeOrigin: true,
// //   logLevel: "debug",

// //   on: {
// //     proxyReq: (proxyReq, req) => {
// //       console.log("Proxying auth request →", req.method, req.originalUrl);

// //       if (req.body && Object.keys(req.body).length) {
// //         const bodyData = JSON.stringify(req.body);

// //         proxyReq.setHeader("Content-Type", "application/json");
// //         proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));

// //         proxyReq.write(bodyData);
// //       }
// //     }
// //   }
// // });

// // // const { createProxyMiddleware } = require("http-proxy-middleware");

// // // module.exports = createProxyMiddleware({
// // //   target: "http://localhost:4001",
// // //   changeOrigin: true,
// // //   pathRewrite: {
// // //     "^/api/v1/auth": "/api/v1/auth"
// // //   },
// // //   logLevel: "debug",

// // //   on: {
// // //     proxyReq: (proxyReq, req) => {
// // //       console.log("Proxying auth request →", req.method, req.originalUrl);

// // //       if (req.body && Object.keys(req.body).length) {
// // //         const bodyData = JSON.stringify(req.body);

// // //         proxyReq.setHeader("Content-Type", "application/json");
// // //         proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));

// // //         proxyReq.write(bodyData);
// // //       }
// // //     }
// // //   }
// // // });

// // // // const { createProxyMiddleware } = require("http-proxy-middleware");

// // // // module.exports = createProxyMiddleware({
// // // //   target: "http://localhost:4001",
// // // //   changeOrigin: true,

// // // //   pathRewrite: {
// // // //     "^/api/v1/auth": "/api/v1/auth"
// // // //   },

// // // //   logLevel: "debug",

// // // //   on: {
// // // //     proxyReq: (proxyReq, req) => {
// // // //       console.log("Proxying auth request →", req.method, req.originalUrl);
// // // //     }
// // // //   }
// // // // });


// // // // // const { createProxyMiddleware } = require("http-proxy-middleware");
// // // // // const services = require("../config/services");

// // // // // module.exports = createProxyMiddleware({
// // // // //   target: services.auth,
// // // // //   changeOrigin: true,

// // // // //   pathRewrite: {
// // // // //     "^/api/v1/auth": "/api/v1/auth"
// // // // //   },

// // // // //   logLevel: "debug"
// // // // // });

// // // // // // const { createProxyMiddleware } = require("http-proxy-middleware");

// // // // // // module.exports = createProxyMiddleware({
// // // // // //   target: "http://localhost:4001",
// // // // // //   changeOrigin: true,

// // // // // //   pathRewrite: {
// // // // // //     "^/api/v1/auth": "/api/v1/auth"
// // // // // //   },

// // // // // //   logLevel: "debug"
// // // // // // });


// // // // // // // const { createProxyMiddleware } = require("http-proxy-middleware");
// // // // // // // const services = require("../config/services");

// // // // // // // module.exports = createProxyMiddleware({
// // // // // // //   target: services.auth,
// // // // // // //   changeOrigin: true
// // // // // // // });


// // // // // // // // const { createProxyMiddleware } = require("http-proxy-middleware");
// // // // // // // // const services = require("../config/services");

// // // // // // // // module.exports = createProxyMiddleware({
// // // // // // // //   target: services.auth,
// // // // // // // //   changeOrigin: true,
// // // // // // // //   pathRewrite: {
// // // // // // // //     "^/auth": "/api/v1/auth"
// // // // // // // //   }
// // // // // // // // });