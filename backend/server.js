// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors({ origin: ['https://peerx.netlify.app', 'http://localhost:3000'] }));

const JWT_SECRET = process.env.JWT_SECRET || 'supersekretnyklucz';
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/peerxdb';

// MODELE

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: String,
  name: String,
  isMentor: { type: Boolean, default: false },
  tokens: { type: Number, default: 0 },
  subjectsBasic: [String],
  subjectsExtended: [String],
  subjectsVocational: [String],
});

const MessageSchema = new mongoose.Schema({
  fromUserId: mongoose.Schema.Types.ObjectId,
  toUserId: mongoose.Schema.Types.ObjectId,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const StudyGroupSchema = new mongoose.Schema({
  subject: String,
  level: String,
  members: [mongoose.Schema.Types.ObjectId],
});

const User = mongoose.model('User', UserSchema);
const Message = mongoose.model('Message', MessageSchema);
const StudyGroup = mongoose.model('StudyGroup', StudyGroupSchema);

// MIDDLEWARE

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Brak tokena' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: 'Niepoprawny token' });
  }
};

// ROUTES

app.post('/api/register', async (req, res) => {
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

app.post('/api/login', async (req, res) => {
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

app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// ... pozostałe endpointy jak w Twoim kodzie ...

// Połączenie z MongoDB i start serwera
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Połączono z MongoDB');
    app.listen(4000, () => console.log('Serwer działa na porcie 4000'));
  })
  .catch(err => {
    console.error('Błąd połączenia z MongoDB:', err);
    process.exit(1);
  });
