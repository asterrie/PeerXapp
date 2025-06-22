const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/users', authMiddleware, async (req, res) => {
  // Opcjonalnie możesz filtrować uczniów po przedmiotach, jeśli podano query param
  const { subject } = req.query;
  try {
    const query = {
      isMentor: false, // tylko uczniowie
    };
    if (subject) {
      query.$or = [
        { subjectsExtended: subject },
        { subjectsVocational: subject }
      ];
    }
    const users = await User.find(query).select('name _id subjectsExtended subjectsVocational');
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

module.exports = router;
