const mongoose = require("mongoose");

const CommissionSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  serviceType: {
    type: String,
    enum: ['Investment Advice', 'Wealth Management', 'Financial Planning'],
    required: true,
  },
  conversionRate: {
    type: Number,
    required: true,
  },
  commissionRate: {
    type: Number,
    required: true,
  },
  earnedCommission: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Unpaid', 'Paid'],
    default: 'Unpaid',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Commission", CommissionSchema);
