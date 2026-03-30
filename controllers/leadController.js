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

exports.updateLead = async (req, res) => {
  try {
    const { best_score, tier } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { best_score, tier },
      { new: true }
    );
    res.json(lead);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
