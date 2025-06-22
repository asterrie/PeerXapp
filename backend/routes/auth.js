// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersekretnyklucz';

router.post('/register', async (req, res) => {
  const { email, password, name, subjectsBasic = [], subjectsExtended = [], subjectsVocational = [] } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Brak danych' });

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Użytkownik istnieje' });

    const passwordHash = await bcrypt.hash(password, 10);
    const isMentor = subjectsExtended.length > 0 || subjectsVocational.length > 0;
    const user = new User({ email, passwordHash, name, isMentor, subjectsBasic, subjectsExtended, subjectsVocational });
    await user.save();

    res.status(201).json({ message: 'Zarejestrowano' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Niepoprawne dane' });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(400).json({ error: 'Niepoprawne dane' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, userId: user._id, name: user.name, isMentor: user.isMentor });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

module.exports = router;