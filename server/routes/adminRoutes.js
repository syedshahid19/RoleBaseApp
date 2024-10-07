const express = require("express");
const router = express.Router();
const {auth, isAdmin} = require("../middleware/Auth");
const { getAllLeads, assignLead, updateLeadStatus, getReports } = require("../controllers/adminController");

// Get all leads
router.get("/leads", auth, isAdmin, getAllLeads);

// Assign lead to vendor
router.put("/leads/:id/assign", auth, isAdmin, assignLead);

// Update lead status and commission
router.put("/leads/:id/status", auth, isAdmin, updateLeadStatus);

// Generate reports
router.get("/reports", auth, isAdmin, getReports);

module.exports = router;