// Import the Mongoose library
const mongoose = require("mongoose");

// Define the user schema using the Mongoose Schema constructor
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["Admin", "Vendor", "User"],
      required: true,
    },
    commission: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Export the Mongoose model for the user schema, using the name "User"
module.exports = mongoose.model("User", userSchema);
