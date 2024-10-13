// controllers/userController.js
const Inquiry = require("../models/inquiry");
const Lead = require("../models/Lead");

// creation of the Lead
exports.createLeadController = async (req, res) => {
  try {
    const { name, contact, service, status, location } = req.body;

    // Check for duplicate leads
    const existingLead = await Lead.findOne({ contact });
    if (existingLead) {
      return res.status(400).json({ message: 'Lead already exists.' });
    }

    const newLead = new Lead({ name, contact, service,location, status });
    await newLead.save();
    res.status(201).json(newLead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get user's transaction history
exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is stored in JWT
    const transactions = await Transaction.find({ userId });

    return res.status(200).json({ success: true, transactions });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get user's forex service inquiries
exports.getForexServiceInquiries = async (req, res) => {
  try {
    const userId = req.user._id;
    const inquiries = await Inquiry.find({ userId });

    return res.status(200).json({ success: true, inquiries });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Convert inquiry to lead
exports.convertInquiryToLead = async (req, res) => {
  try {
    const inquiryId = req.params.id;
    const inquiry = await Inquiry.findById(inquiryId);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    // Create a lead based on the inquiry
    const newLead = new Lead({
      title: inquiry.title, // Assuming inquiry has a title
      description: inquiry.description, // Assuming inquiry has a description
      createdBy: req.user._id, // Link to the user who initiated the transaction
      // Add any other relevant fields for a lead here
    });

    await newLead.save();
    
    // Optionally, you can delete the inquiry after converting it to a lead
    await Inquiry.findByIdAndDelete(inquiryId);

    return res.status(201).json({ success: true, lead: newLead });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
