// routes/teachers.js
const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/teachers', authMiddleware, async (req, res) => {
  try {
    const teachers = await User.find({ isMentor: true });
    res.json(teachers);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

module.exports = router;
