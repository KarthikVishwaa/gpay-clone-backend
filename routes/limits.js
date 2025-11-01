const express = require('express');
const auth = require('../middleware/auth');
const ExpenseLimit = require('../models/ExpenseLimit');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { category, amount } = req.body;
  if (!category || !amount) return res.status(400).json({ message: 'category+amount required' });

  const existing = await ExpenseLimit.findOne({ user: req.user._id, category });
  if (existing) {
    existing.amount = amount;
    await existing.save();
    return res.json(existing);
  } else {
    const newLimit = await ExpenseLimit.create({ user: req.user._id, category, amount });
    return res.json(newLimit);
  }
});

router.get('/', auth, async (req, res) => {
  const limits = await ExpenseLimit.find({ user: req.user._id });
  res.json(limits);
});

module.exports = router;
