const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getReports } = require("../controllers/reportController");

const router = express.Router();

router.get("/", authMiddleware, getReports);

module.exports = router;