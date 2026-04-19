const express = require("express");
const controller = require("../controllers/admin.controller");
const requireSuperAdmin = require("../middlewares/requireSuperAdmin");

const router = express.Router();

// ── Public admin routes ──────────────────────────────────────────────
// Any admin can log in
router.post("/login", controller.login);

// Password reset (self-service via OTP)
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password",  controller.resetPassword);

// ── Super Admin only routes ───────────────────────────────────────────
// Only a super admin can create a new admin
router.post("/register",         requireSuperAdmin, controller.register);

// List all admins
router.get("/list",              requireSuperAdmin, controller.listAdmins);

// Delete / deactivate an admin
router.delete("/:id",            requireSuperAdmin, controller.deleteAdmin);

// Super admin force-resets an admin's password (no OTP needed)
router.post("/:id/reset-password", requireSuperAdmin, controller.forceResetPassword);

module.exports = router;
