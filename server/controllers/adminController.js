const User = require("../models/User");
const Lead = require("../models/Lead");
const Commission = require("../models/Commission");

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
      ).populate("assignedTo", "firstName").exec();
  
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

//   // Set or modify commission rates for vendors
// exports.setCommissionRate = async (req, res) => {
//   try {
//     const { vendorId, serviceType, conversionRate, commissionRate } = req.body;

//     let commission = await Commission.findOne({ vendorId, serviceType });

//     if (commission) {
//       // Update existing commission rate
//       commission.conversionRate = conversionRate;
//       commission.commissionRate = commissionRate;
//       await commission.save();
//       res.status(200).json({ message: 'Commission rate updated successfully', commission });
//     } else {
//       // Create new commission
//       const newCommission = new Commission({ vendorId, serviceType, conversionRate, commissionRate });
//       await newCommission.save();
//       res.status(201).json({ message: 'Commission rate set successfully', commission: newCommission });
//     }
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Track commissions earned by vendors
// exports.trackCommissions = async (req, res) => {
//   try {
//     const commissions = await Commission.find().populate('vendorId');
//     res.json(commissions);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Mark commissions as paid
// exports.markAsPaid = async (req, res) => {
//   try {
//     const { commissionId } = req.params;
//     const commission = await Commission.findById(commissionId);

//     if (!commission) return res.status(404).json({ message: "Commission not found" });

//     commission.status = 'Paid';
//     await commission.save();
//     res.json({ message: "Commission marked as paid", commission });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
  
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