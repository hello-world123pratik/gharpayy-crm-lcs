const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  source: { type: String, required: true }, // [cite: 48]
  status: { 
    type: String, 
    enum: [
      'New Lead', 'Contacted', 'Requirement Collected', 
      'Property Suggested', 'Visit Scheduled', 'Visit Completed', 
      'Booked', 'Lost'
    ], // 
    default: 'New Lead' 
  },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }, // [cite: 50]
  agentName: String,
  visitDetails: { // [cite: 72-76]
    property: { type: String, default: '' },
    scheduledAt: { type: Date },
    outcome: { type: String, default: 'Pending' } // 
  }
}, { timestamps: true }); // Timestamps handle the automated 'Received At' [cite: 49]

module.exports = mongoose.model('Lead', LeadSchema);