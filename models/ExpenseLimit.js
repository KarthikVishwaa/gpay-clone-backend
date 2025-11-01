const mongoose = require('mongoose');

const limitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

limitSchema.index({ user: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('ExpenseLimit', limitSchema);
