const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    enum: ["India", "USA", "UK", "China", "Japan"],
    required: true,
  },
  service: {
    type: String,
    enum: ["Investment Advice", "Wealth Management", "Financial Planning"],
    required: true,
  },
  status: {
    type: String,
    enum: ["New", "Pending", "Deal Won", "Deal Lost"],
    default: "New",
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Vendor model
    ref: "Vendor",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Lead", LeadSchema);
