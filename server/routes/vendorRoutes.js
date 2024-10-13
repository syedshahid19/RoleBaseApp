const express = require("express");
const router = express.Router();
const { auth, isVendor } = require("../middleware/Auth");
const {
  getAssignedLeads,
  updateLeadStatus,
  createVendor,
  getVendors,
  getEarnedCommissions
} = require("../controllers/vendorController");

// creation of vendor
router.post("/Createvendor", auth, isVendor, createVendor);

// get vendors from vendor protected route
router.get("/getAllVendors", auth, isVendor, getVendors);

// Get leads assigned to the vendor
router.get("/:vendorId/getAssignedleads", auth, isVendor, getAssignedLeads);

// Update lead status by the vendor
router.put("/leads/:id/status", auth, isVendor, updateLeadStatus);

// Get earned commissions for the vendor
router.get("/commissions", auth, isVendor, getEarnedCommissions);

module.exports = router;
