const Lead = require('../models/Lead');

exports.createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getTier = (score) => {
  if (score >= 4000) return 'Platinum';
  if (score >= 2000) return 'Gold';
  if (score >= 1000) return 'Silver';
  return 'Bronze';
};

exports.updateLead = async (req, res) => {
  try {
    const updateData = req.body;
    let calcBest = null;
    let calcTier = null;

    if (updateData.spin_results && updateData.spin_results.length > 0) {
      calcBest = Math.max(0, ...updateData.spin_results.map(r => r.score));
      calcTier = exports.getTier(calcBest);
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { 
        ...updateData,
        ...(calcBest !== null && { best_score: calcBest }),
        ...(calcTier !== null && { tier: calcTier })
      },
      { returnDocument: 'after' }
    );
    res.json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getLeadByPhoneInterest = async (req, res) => {
  try {
    const { phone, interest } = req.query;
    if (!phone || !interest) {
      return res.status(400).json({ error: 'phone and interest required' });
    }
    const lead = await Lead.findOne({ phone, interest });
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllLeads = async (req, res) => {
  try {
    const { interest, sort = 'desc' } = req.query;
    let query = {};
    if (interest && interest !== 'All') {
      query.interest = interest;
    }
    const leads = await Lead.find(query)
      .sort({ best_score: sort === 'desc' ? -1 : 1 });
    
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

