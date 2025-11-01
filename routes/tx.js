const express = require('express');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const ExpenseLimit = require('../models/ExpenseLimit');
const Notification = require('../models/Notification');
const User = require('../models/User');

const router = express.Router();

function monthRange(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return { start, end };
}

router.post('/send', auth, async (req, res) => {
  try {
    const { toEmail, amount, category = 'other', note } = req.body;
    if (!toEmail || !amount || amount <= 0) return res.status(400).json({ message: 'invalid payload' });

    const sender = req.user;
    if (sender.balance < amount) return res.status(400).json({ message: 'insufficient balance' });

    sender.balance -= amount;
    await sender.save();

    const tx = await Transaction.create({ from: sender._id, toEmail, amount, category, note });

    const recipient = await User.findOne({ email: toEmail });
    if (recipient) {
      recipient.balance += amount;
      await recipient.save();
    }

    if (sender.balance <= sender.lowBalanceThreshold) {
      await Notification.create({
        user: sender._id,
        type: 'low_balance',
        message: `Low balance: ₹${sender.balance} (threshold ₹${sender.lowBalanceThreshold})`,
        data: { balance: sender.balance }
      });
    }

    const { start, end } = monthRange(new Date());
    const monthTxs = await Transaction.aggregate([
      { $match: { from: sender._id, category, createdAt: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const spent = (monthTxs[0] && monthTxs[0].total) || 0;

    const limitDoc = await ExpenseLimit.findOne({ user: sender._id, category });
    if (limitDoc && spent >= limitDoc.amount) {
      await Notification.create({
        user: sender._id,
        type: 'limit_reached',
        message: `Monthly limit reached for ${category}: ₹${spent} / ₹${limitDoc.amount}`,
        data: { category, spent, limit: limitDoc.amount }
      });
    }

    res.json({ tx, newBalance: sender.balance });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

router.get('/', auth, async (req, res) => {
  const txs = await Transaction.find({ from: req.user._id }).sort({ createdAt: -1 });
  res.json(txs);
});

module.exports = router;
