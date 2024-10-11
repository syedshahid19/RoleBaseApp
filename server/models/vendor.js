const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  userId: {  
    type: mongoose.Schema.Types.ObjectId, // Reference to the Vendor model
    ref: 'User', 
    required: true 
  },
  location: {
    type: String,
    enum: ['India', 'USA', 'UK', 'China', 'Japan'],
    required: true
  },
  service: {
    type: String,
    enum: ['Investment Advice', 'Wealth Management', 'Financial Planning'],
    required: true
  },
  commissionRates: {
    type: Map,
    of: Number, // Store service type and corresponding commission rate
    default: {},
  },
  leadsConverted: {
    type: Number,
    default: 0,
  },
  earnedCommission: { 
    type: Number, 
    default: 0 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', vendorSchema);

