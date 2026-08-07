const express = require("express");
const { createLead, getLeads, getLeadById, updateLead, deleteLead } = require("../controllers/leadController")
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/leads", authMiddleware, createLead);
router.get("/leads", authMiddleware, getLeads)
router.get("/leads/:id", authMiddleware, getLeadById)
router.put("/leads/:id", authMiddleware, updateLead)
router.delete("/leads/:id", authMiddleware, isAdmin, deleteLead)

module.exports = router;