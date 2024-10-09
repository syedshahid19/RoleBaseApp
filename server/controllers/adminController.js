const User = require("../models/User");
const Lead = require("../models/Lead");

// Get all leads across all stages
exports.getAllLeads = async(req, res)=>{
    try {
        const leads = await Lead.find()
        return res.status(200).json({ success: true, leads });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

// Assign lead to a vendor or team member
exports.assignLead = async (req, res) => {
    try {
      const leadId = req.params.id;
      const { assignedTo } = req.body; // vendor ID
  
      const lead = await Lead.findByIdAndUpdate(
        leadId,
        { assignedTo },
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
        return res.status(404).json({ success: false, message: "Lead not found" });
      }
  
      return res.status(200).json({ success: true, lead });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  
  // Generate reports on lead performance
  exports.getReports = async (req, res) => {
    try {
      const totalLeads = await Lead.countDocuments();
      const wonLeads = await Lead.countDocuments({ status: "Deal Won" });
      const lostLeads = await Lead.countDocuments({ status: "Deal Lost" });
      const pendingLeads = await Lead.countDocuments({ status: "Pending" });
      const newLeads = await Lead.countDocuments({ status: "New" });
  
      const report = {
        totalLeads,
        wonLeads,
        lostLeads,
        pendingLeads,
        newLeads,
      };
  
      return res.status(200).json({ success: true, report });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  };