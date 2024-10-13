const User = require("../models/User");
const Lead = require("../models/Lead");
const Vendor = require("../models/vendor");

// Get all leads across all stages
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find();
    return res.status(200).json({ success: true, leads });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Assign lead to a vendor or team member
exports.assignLead = async (req, res) => {
  try {
    const leadId = req.params.id;
    const { assignedTo } = req.body; // vendor ID

    const lead = await Lead.findByIdAndUpdate(
      leadId,
      { assignedTo },
      { new: true }
    )
      .populate("assignedTo", "firstName")
      .exec();

    if (!lead) {
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }

    return res.status(200).json({ success: true, lead });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update lead status and commission
exports.updateLeadStatus = async (req, res) => {
  try {
    const leadId = req.params.id;
    const { status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      leadId,
      { status },
      { new: true }
    );

    if (!lead) {
      return res
        .status(404)
        .json({ success: false, message: "Lead not found" });
    }

    return res.status(200).json({ success: true, lead });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Set commission rate for a vendor
exports.setCommission = async (req, res) => {
  const { vendorId, serviceType, commissionRate } = req.body;

  try {
    let vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Set the commission rate for the given service type
    vendor.commissionRates.set(serviceType, commissionRate);
    await vendor.save();

    return res.status(200).json({
      success: true,
      message: `Commission rate of ${commissionRate}% set for ${serviceType}`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get commission rates for a vendor
exports.getCommission = async (req, res) => {
  const { vendorId } = req.params;

  try {
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    return res
      .status(200)
      .json({ success: true, commissionRates: vendor.commissionRates });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get commission rates for all vendors
exports.getAllVendorCommission = async (req, res) => {
  try {
    // Fetch all vendors
    const vendors = await Vendor.find({}).populate("userId"); // Populating user info (if you need vendor's name from the User model)

    if (!vendors || vendors.length === 0) {
      return res.status(404).json({ message: "No vendors found" });
    }

    // Create array with vendor names and commission rates
    const vendorCommissionData = vendors.map((vendor) => ({
      vendorName: `${vendor.userId.firstName} ${vendor.userId.lastName}`, // firstName and lastName exist in User model
      location: vendor.location,
      service: vendor.service,
      leadsConverted: vendor.leadsConverted,
      commissionRates: Array.from(vendor.commissionRates), // Convert the Map to an array for easy display
    }));

    return res.status(200).json({ vendorCommissionData });
  } catch (error) {
    console.error("Error fetching vendor commissions:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching commissions" });
  }
};
