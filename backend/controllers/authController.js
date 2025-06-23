// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

exports.registerUser = async (req, res) => {
  const { name, email, password, role, subjectsExtended = [] } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Brak wymaganych danych' });
  }
  if (role === 'student' && subjectsExtended.length === 0) {
    return res.status(400).json({ error: 'Uczeń musi wybrać co najmniej jeden przedmiot rozszerzony' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Użytkownik już istnieje' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash, role, subjectsExtended });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Błąd serwera przy rejestracji' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Niepoprawne dane logowania' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Niepoprawne dane logowania' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Błąd serwera przy logowaniu' });
  }
};