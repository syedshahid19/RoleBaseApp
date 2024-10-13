const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middleware/Auth");
const {
  getAllLeads,
  assignLead,
  updateLeadStatus,
  setCommission,
  getAllVendorCommission,
} = require("../controllers/adminController");
const { getVendors } = require("../controllers/vendorController");

// Get all leads
router.get("/leads", auth, isAdmin, getAllLeads);

// Get all leads
router.get("/getVendors", auth, isAdmin, getVendors);

// Assign lead to vendor
router.put("/leads/:id/assignVendor", auth, isAdmin, assignLead);

// Update lead status and commission
router.put("/leads/:id/status", auth, isAdmin, updateLeadStatus);

// Set commision to vendors
router.post("/set-commission", auth, isAdmin, setCommission);

// Get commissions rates for all vendors
router.get("/get-all-commissions", auth, isAdmin, getAllVendorCommission);

module.exports = router;
