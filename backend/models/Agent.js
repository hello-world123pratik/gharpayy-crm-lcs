const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  activeLeads: { type: Number, default: 0 } // Used for workload balancing [cite: 57]
});

module.exports = mongoose.model('Agent', AgentSchema);