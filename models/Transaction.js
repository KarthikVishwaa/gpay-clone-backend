const mongoose = require('mongoose');

const txSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, default: 'other' },
  note: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', txSchema);
