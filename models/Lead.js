const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  interest: { type: String, enum: ['HR Bridge', 'Digi Bridge', 'Both'], required: true },
  best_score: { type: Number, default: 0 },
  tier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze' },
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
