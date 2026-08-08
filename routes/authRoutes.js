const express = require("express");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware")
const { registerUser, loginUser, getUsers } = require("../controllers/authController")


const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/users", authMiddleware, isAdmin, getUsers);

module.exports = router;