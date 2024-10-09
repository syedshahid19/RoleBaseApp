// controllers/vendorController.js
const Lead = require("../models/Lead");
const User = require("../models/User");
const Vendor = require("../models/vendor");


// Create Vendor
exports.createVendor = async (req, res) => {
  try {
    const { userId, location, service } = req.body;

    // Find the user by ID and select firstName and phoneNumber
    const user = await User.findById(userId).select('firstName phoneNumber');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check for duplicate vendor
    const existingVendor = await Vendor.findOne({ userId });
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: 'Vendor already exists'
      });
    }


   // Create a new vendor with the user reference
   const newVendor = new Vendor({
    userId: user._id, // Reference to the User model
    location,
    service
    });

    await newVendor.save();
    res.status(201).json({ success: true, newVendor });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating vendor',
      error: error.message
    });
  }
};

// Get all vendors
exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("userId", "firstName phoneNumber");
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all leads assigned to the vendor
exports.getAssignedLeads = async (req, res) => {
  try {
    const vendorId = req.params.vendorId; // Extract vendor ID from URL
    console.log("vendorId", vendorId);
    
    if (!vendorId) {
      return res.status(400).json({ success: false, message: "Vendor ID missing" });
    }

    const leads = await Lead.find({ assignedTo: vendorId });
    return res.status(200).json({ success: true, leads });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};


// Update lead status by the vendor
exports.updateLeadStatus = async (req, res) => {
  try {
    const leadId = req.params.id;
    const { status } = req.body; // new status for the lead

    const lead = await Lead.findByIdAndUpdate(
      leadId,
      { status },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    return res.status(200).json({ success: true, lead });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get team performance metrics
exports.getTeamPerformance = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const leads = await Lead.find({ assignedTo: vendorId });
    
    // Calculate performance metrics (for example, conversion rate)
    const totalLeads = leads.length;
    const convertedLeads = leads.filter(lead => lead.status === "Deal Won").length;

    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    return res.status(200).json({ success: true, totalLeads, convertedLeads, conversionRate });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get earned commissions for the vendor
exports.getEarnedCommissions = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const leads = await Lead.find({ assignedTo: vendorId });

    // Sum up commissions from converted leads
    const earnedCommissions = leads.reduce((total, lead) => {
      return lead.status === "Deal Won" ? total + lead.commission : total;
    }, 0);

    return res.status(200).json({ success: true, earnedCommissions });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
