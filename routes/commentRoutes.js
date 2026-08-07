const express = require("express");
const { updateComment, getComment, deleteComment, createComment } = require("../controllers/commentController")
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/comments", authMiddleware, createComment);
router.get("/comments",authMiddleware, getComment);
router.put("/comments/:id", authMiddleware, updateComment);
router.delete("/comments/:id", authMiddleware, isAdmin, deleteComment)

module.exports = router;