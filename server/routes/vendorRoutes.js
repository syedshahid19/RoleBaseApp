// routes/vendor.js
const express = require("express");
const router = express.Router();
const { auth, isVendor } = require("../middleware/Auth");
const {
  getAssignedLeads,
  updateLeadStatus,
  getTeamPerformance,
  getEarnedCommissions,
} = require("../controllers/vendorController");

// Get leads assigned to the vendor
router.get("/leads", auth, isVendor, getAssignedLeads);

// Update lead status by the vendor
router.put("/leads/:id/status", auth, isVendor, updateLeadStatus);

// Get team performance metrics
router.get("/performance", auth, isVendor, getTeamPerformance);

// Get earned commissions for the vendor
router.get("/commissions", auth, isVendor, getEarnedCommissions);

module.exports = router;
