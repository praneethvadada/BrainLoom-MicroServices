const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register user with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - country
 *               - preferred_language
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *               name:
 *                 type: string
 *                 example: John Doe
 *               country:
 *                 type: string
 *                 example: India
 *               preferred_language:
 *                 type: string
 *                 example: English
 *     responses:
 *       201:
 *         description: User registered successfully
 */
/**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: Verify email OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               otp:
 *                 type: string
 *                 example: 482193
 *     responses:
 *       200:
 *         description: Email verified
 */


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login with email or username
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 */


/**
 * @swagger
 * /refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: your_refresh_token_here
 *     responses:
 *       200:
 *         description: New access token issued
 */

router.post("/refresh", controller.refresh);

/**
 * @swagger
 * /logout-device:
 *   post:
 *     summary: Logout current device
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: your_refresh_token_here
 *     responses:
 *       200:
 *         description: Device logged out
 */
router.post("/logout-device", controller.logoutDevice);

/**
 * @swagger
 * /logout-all:
 *   post:
 *     summary: Logout from all devices
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: user_uuid_here
 *     responses:
 *       200:
 *         description: All sessions removed
 */
router.post("/logout-all", controller.logoutAll);


/**
 * @swagger
 * /delete-account:
 *   post:
 *     summary: Soft delete user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: user_uuid_here
 */
// router.post("/delete-account", controller.deleteAccount);
router.post(
  "/delete-account",
  authMiddleware,
  controller.deleteAccount
);


router.post("/login", controller.login);
router.post("/verify-otp", controller.verifyOTP);

router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("name").notEmpty(),
    body("country").notEmpty(),
    body("preferred_language").notEmpty()
  ],
  controller.register
);

module.exports = router;
