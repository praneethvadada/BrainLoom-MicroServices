// src/middleware/roleMiddleware.js

export const requireAdmin = (req, res, next) => {


  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: admin only" });
  }

  next();
};

// // src/middleware/roleMiddleware.js

// export const requireAdmin = (req, res, next) => {
//   const role = req.headers["x-user-role"];

//   if (!role) {
//     return res.status(401).json({
//       message: "Unauthorized: missing gateway headers"
//     });
//   }

//   if (role !== "admin") {
//     return res.status(403).json({
//       message: "Forbidden: admin only"
//     });
//   }

//   next();
// };

// export const requireSuperAdmin = (req, res, next) => {
//   const role = req.headers["x-user-role"];
//   const isSuper = req.headers["x-user-super"];

//   if (!role) {
//     return res.status(401).json({
//       message: "Unauthorized: missing gateway headers"
//     });
//   }

//   if (role !== "admin" || isSuper !== "true") {
//     return res.status(403).json({
//       message: "Forbidden: super-admin only"
//     });
//   }

//   next();
// };

// // // src/middleware/roleMiddleware.js
// // export const requireAdmin = (req, res, next) => {
// //   if (!req.user) return res.status(401).json({ message: "Unauthorized" });
// //   if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden: admin only" });
// //   next();
// // };

// // export const requireSuperAdmin = (req, res, next) => {
// //   if (!req.user) return res.status(401).json({ message: "Unauthorized" });
// //   // for admins we stored is_super in token if set during sign-in
// //   if (req.user.role !== "admin" || !req.user.is_super) return res.status(403).json({ message: "Forbidden: super-admin only" });
// //   next();
// // };
