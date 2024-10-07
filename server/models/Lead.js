// const mongoose = require("mongoose");

// const leadSchema = new mongoose.Schema({
//     name:{
//       type: String,
//       trim: true,
//     },
//     email:{
//       type: String,
//       trim: true,
//     },
//     phone:{
//       type: Number,
//     },
//     status:{
//         type:String, 
//         enum: ['New', 'Pending', 'Deal Won', 'Deal Lost'], 
//         default: 'New'
//     },
//     assignedTo: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'User' 
//     },
//     createdBy: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'User' 
//     },
//     createdAt: { 
//         type: Date, 
//         default: Date.now 
//     },
//     commission: { 
//         type: Number, 
//         default: 0 
//     },  // commission for the lead
// })

// module.exports = mongoose.model("Lead", leadSchema);




// models/Lead.js
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
  service: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["New", "Pending", "Deal Won", "Deal Lost"],
    default: "New",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Lead", LeadSchema);
