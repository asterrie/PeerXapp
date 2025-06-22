// routes/mentors.js
const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/mentors', authMiddleware, async (req, res) => {
  const { subject, level } = req.query;
  const query = {
    isMentor: true,
    $or: [
      { subjectsExtended: subject },
      { subjectsVocational: subject },
    ]
  };
  try {
    const mentors = await User.find(query).select('name _id');
    res.json(mentors);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

module.exports = router;
