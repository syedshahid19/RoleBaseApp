const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
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

