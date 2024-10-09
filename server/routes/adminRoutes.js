const express = require("express");
const router = express.Router();
const {auth, isAdmin} = require("../middleware/Auth");
const { getAllLeads, assignLead, updateLeadStatus, getReports } = require("../controllers/adminController");
const {createVendor, getVendors} = require("../controllers/vendorController");

// Get all leads
router.get("/leads", auth, isAdmin, getAllLeads);

// Create Vendors
// router.post('/vendors',auth, isAdmin, createVendor);

// Get all leads
router.get('/getVendors', auth, isAdmin,getVendors);

// Assign lead to vendor
router.put("/leads/:id/assignVendor", auth, isAdmin, assignLead);

// Update lead status and commission
router.put("/leads/:id/status", auth, isAdmin, updateLeadStatus);

// Generate reports
router.get("/reports", auth, isAdmin, getReports);

module.exports = router;