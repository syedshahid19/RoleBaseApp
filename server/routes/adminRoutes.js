const express = require("express");
const router = express.Router();
const {auth, isAdmin} = require("../middleware/Auth");
const { getAllLeads, assignLead, updateLeadStatus, setCommission, getCommission, getAllVendorCommission } = require("../controllers/adminController");
const {getVendors} = require("../controllers/vendorController");

// Get all leads
router.get("/leads", auth, isAdmin, getAllLeads);

// Get all leads
router.get('/getVendors', auth, isAdmin,getVendors);

// Assign lead to vendor
router.put("/leads/:id/assignVendor", auth, isAdmin, assignLead);

// Update lead status and commission
router.put("/leads/:id/status", auth, isAdmin, updateLeadStatus);

// Set commision to vendors
router.post("/set-commission", setCommission);

// Get commission rates for a vendor based on selected vendor
router.get("/get-commission/:vendorId", getCommission);

// Get commissions rates for all vendors
router.get("/get-all-commissions", getAllVendorCommission);



module.exports = router;