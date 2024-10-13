const Lead = require("../models/Lead");

// creation of the Lead
exports.createLeadController = async (req, res) => {
  try {
    const { name, contact, service, status, location } = req.body;

    // Check for duplicate leads
    const existingLead = await Lead.findOne({ contact });
    if (existingLead) {
      return res.status(400).json({ message: "Lead already exists." });
    }

    const newLead = new Lead({ name, contact, service, location, status });
    await newLead.save();
    res.status(201).json(newLead);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
