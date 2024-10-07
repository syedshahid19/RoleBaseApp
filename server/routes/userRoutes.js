// routes/user.js
const express = require("express");
const router = express.Router();
const { auth, isUser } = require("../middleware/Auth");
const {
  getTransactionHistory,
  getForexServiceInquiries,
  convertInquiryToLead,
  createLeadController
} = require("../controllers/userController");

// Create Lead
router.post("/createLead", createLeadController);

// Get user's transaction history
router.get("/transactions", auth, isUser, getTransactionHistory);

// Get user's forex service inquiries
router.get("/inquiries", auth, isUser, getForexServiceInquiries);

// Convert inquiry to lead
router.post("/inquiries/:id/convert", auth, isUser, convertInquiryToLead);

module.exports = router;
