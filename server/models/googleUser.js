const mongoose = require("mongoose");

// Define the Google User Schema
const googleUserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["Admin", "Vendor", "User"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GoogleUser", googleUserSchema);
