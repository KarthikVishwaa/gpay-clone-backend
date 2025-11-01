const express = require('express');
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const list = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(list);
});

router.post('/:id/read', auth, async (req, res) => {
  const id = req.params.id;
  await Notification.findByIdAndUpdate(id, { read: true });
  res.json({ ok: true });
});

module.exports = router;
