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
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', vendorSchema);

