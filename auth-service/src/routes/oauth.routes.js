const express = require("express");
const controller = require("../controllers/oauth.controller");

const router = express.Router();

/**
 * @swagger
 * /google:
 *   post:
 *     summary: Google OAuth login
 */
router.post("/google", controller.google);

/**
 * @swagger
 * /github:
 *   post:
 *     summary: GitHub OAuth login
 *     tags: [OAuth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accessToken
 *             properties:
 *               accessToken:
 *                 type: string
 *                 example: github_access_token_here
 */
router.post("/github", controller.github);


/**
 * @swagger
 * /linkedin:
 *   post:
 *     summary: LinkedIn OAuth login
 */
router.post("/linkedin", controller.linkedin);


module.exports = router;