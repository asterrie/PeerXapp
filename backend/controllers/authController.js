const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'supersekretnyklucz';

exports.registerUser = async (req, res) => {
  const { email, password, name, role, subjectsBasic = [], subjectsExtended = [], subjectsVocational = [] } = req.body;

  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: 'Brak wymaganych danych' });
  }

  if (role === 'student' && subjectsExtended.length === 0) {
    return res.status(400).json({ error: 'Uczeń musi wybrać co najmniej jeden przedmiot rozszerzony' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Użytkownik istnieje' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      passwordHash,
      name,
      role,
      subjectsBasic,
      subjectsExtended,
      subjectsVocational,
    });
    await user.save();
    res.status(201).json({ message: 'Zarejestrowano pomyślnie' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Niepoprawne dane' });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(400).json({ error: 'Niepoprawne dane' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      userId: user._id,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};
