// models/Inquiry.js
const mongoose = require("mongoose");

const InquirySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Reference to the user who made the inquiry
  },
  title: {
    type: String,
    required: true, // Title of the inquiry
  },
  description: {
    type: String,
    required: true, // Description of the inquiry
  },
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp for when the inquiry was created
  },
  status: {
    type: String,
    enum: ["Pending", "Resolved", "Closed"], // Status of the inquiry
    default: "Pending",
  },
});


module.exports = mongoose.model("Inquiry", InquirySchema);;
