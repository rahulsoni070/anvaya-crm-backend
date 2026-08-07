const express = require("express");
const { createAgent, getAgent, updateAgent, deleteAgent } = require("../controllers/salesAgentController")
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/agents", authMiddleware, isAdmin, createAgent)
router.get("/agents", authMiddleware, getAgent)
router.put("/agents/:id", authMiddleware, isAdmin, updateAgent)
router.delete("/agents/:id", authMiddleware, isAdmin, deleteAgent)

module.exports = router;