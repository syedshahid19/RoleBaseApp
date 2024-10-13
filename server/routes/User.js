const express = require("express");
const router = express.Router();
const { login, signup } = require("../controllers/Auth");

// POST request for user login
router.post("/login", login);

// POST request for user signup
router.post("/signup", signup);

module.exports = router;
