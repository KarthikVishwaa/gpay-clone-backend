const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  displayName: { type: String },
  balance: { type: Number, default: 2000 },
  lowBalanceThreshold: { type: Number, default: 200 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
