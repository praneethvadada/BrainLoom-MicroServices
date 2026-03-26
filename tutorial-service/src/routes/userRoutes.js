// src/routes/userRoutes.js

import express from "express";

const router = express.Router();

router.get("/me", (req, res) => {

  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  res.json({
    message: "profile",
    user: req.user
  });

});

export default router;

// // src/routes/userRoutes.js
// import express from "express";
// // import { authenticate } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.get("/me", authenticate, (req, res) => {
//   // req.user contains id and role
//   res.json({ message: "profile", user: req.user });
// });

// export default router;
