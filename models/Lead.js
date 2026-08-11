const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  interest: { type: String, enum: ['Jims HR', 'Digi Bridge', 'Both'], required: true },
  companyName: { type: String },
  otherInfo: { type: String },
  best_score: { type: Number, default: 0 },
  tier: { type: String, enum: ['Platinum', 'Gold', 'Silver', 'Bronze', 'None'], default: 'None' },
  spins_used: { type: Number, default: 0, min: 0, max: 3 },
  spin_results: [{
    score: { type: Number, required: true }
  }],
  created_at: { type: Date, default: Date.now }
});

leadSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

leadSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Lead', leadSchema);
