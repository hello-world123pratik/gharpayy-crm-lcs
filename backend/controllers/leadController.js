const Lead = require('../models/Lead');
const Agent = require('../models/Agent');

// 1. Automated Lead Capture [cite: 43-44]
exports.captureLead = async (req, res) => {
  try {
    const { name, phone, source } = req.body;
    
    // Workload Balancing: Assign to agent with fewest active leads [cite: 57]
    const agent = await Agent.findOne().sort({ activeLeads: 1 });
    if (!agent) return res.status(500).json({ error: "No agents available for assignment" });

    const newLead = await Lead.create({
      name, phone, source,
      assignedAgent: agent._id,
      agentName: agent.name
    });

    await Agent.findByIdAndUpdate(agent._id, { $inc: { activeLeads: 1 } });
    res.status(201).json(newLead);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// 2. Dashboard Analytics 
exports.getStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments(); // [cite: 82]
    const visits = await Lead.countDocuments({ status: 'Visit Scheduled' }); // [cite: 84]
    const booked = await Lead.countDocuments({ status: 'Booked' }); // [cite: 85]
    
    // Breakdown for each pipeline stage [cite: 83]
    const pipelineBreakdown = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    res.json({ totalLeads, visits, booked, pipelineBreakdown });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getLeads = async (req, res) => {
  const leads = await Lead.find().sort({ updatedAt: -1 });
  res.json(leads);
};

exports.updateLead = async (req, res) => {
  const { status, property, scheduledAt, outcome } = req.body;
  const updateFields = { status };
  
  if (property) updateFields['visitDetails.property'] = property; // [cite: 74]
  if (scheduledAt) updateFields['visitDetails.scheduledAt'] = scheduledAt; // [cite: 75]
  if (outcome) updateFields['visitDetails.outcome'] = outcome; // 

  const updated = await Lead.findByIdAndUpdate(req.params.id, updateFields, { new: true });
  res.json(updated);
};