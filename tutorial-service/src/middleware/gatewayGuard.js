export const gatewayGuard = (req, res, next) => {
  console.log("Gateway key received:", req.headers["x-internal-gateway-key"]);
  console.log("Expected key:", process.env.INTERNAL_GATEWAY_KEY);

  const gatewayKey = req.headers["x-internal-gateway-key"];

  if (!gatewayKey || gatewayKey !== process.env.INTERNAL_GATEWAY_KEY) {
    return res.status(403).json({
      message: "Direct service access forbidden"
    });
  }

  next();
};

// export const gatewayGuard = (req, res, next) => {

//   const gatewayKey = req.headers["x-internal-gateway-key"];

//   if (!gatewayKey || gatewayKey !== process.env.INTERNAL_GATEWAY_KEY) {

//     return res.status(403).json({
//       message: "Direct service access forbidden"
//     });

//   }

//   next();

// };

// // export const gatewayGuard = (req, res, next) => {

// //   const gatewayKey = req.headers["x-internal-gateway-key"];

// //   if (!gatewayKey || gatewayKey !== process.env.INTERNAL_GATEWAY_KEY) {
// //     return res.status(403).json({
// //       message: "Direct service access forbidden"
// //     });
// //   }

// //   next();
// // };

// // // export const gatewayGuard = (req, res, next) => {

// // //   const gatewayKey = req.headers["x-internal-gateway-key"];

// // //   if (!gatewayKey) {
// // //     return res.status(403).json({
// // //       message: "Direct service access forbidden"
// // //     });
// // //   }

// // //   if (gatewayKey !== process.env.INTERNAL_GATEWAY_KEY) {
// // //     return res.status(403).json({
// // //       message: "Invalid gateway key"
// // //     });
// // //   }

// // //   next();
// // // };