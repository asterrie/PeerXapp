// routes/profile.js
const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

module.exports = router;