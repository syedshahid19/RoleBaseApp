const express = require("express");
const router = express.Router();
const { auth, isUser } = require("../middleware/Auth");
const { createLeadController } = require("../controllers/userController");

// Create Lead
router.post("/createLead", createLeadController);

module.exports = router;
