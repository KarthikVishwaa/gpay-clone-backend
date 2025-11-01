const express = require('express');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const ExpenseLimit = require('../models/ExpenseLimit');
const Notification = require('../models/Notification');

const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = req.user;
  const limits = await ExpenseLimit.find({ user: user._id });
  const notifs = await Notification.find({ user: user._id }).sort({ createdAt: -1 }).limit(10);
  const txs = await Transaction.find({ from: user._id }).sort({ createdAt: -1 }).limit(10);
  res.json({
    profile: { email: user.email, displayName: user.displayName, balance: user.balance, lowBalanceThreshold: user.lowBalanceThreshold },
    limits,
    notifications: notifs,
    recentTx: txs
  });
});

module.exports = router;
