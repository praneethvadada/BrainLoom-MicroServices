const express = require("express");
const controller = require("../controllers/internal.controller");

const router = express.Router();

router.get("/claims/:userId", controller.getClaims);

module.exports = router;
