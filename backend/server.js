// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'https://peerx.netlify.app' }));


const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true
});


// MODELE

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: String,
  name: String,
  isMentor: { type: Boolean, default: false },
  tokens: { type: Number, default: 0 },
  subjectsBasic: [String],       // np. ["Matematyka", "Fizyka"]
  subjectsExtended: [String],    // rozszerzenia - oznaczają mentora w tych przedmiotach
  subjectsVocational: [String],  // przedmioty zawodowe (dla techników)
});

const MessageSchema = new mongoose.Schema({
  fromUserId: mongoose.Schema.Types.ObjectId,
  toUserId: mongoose.Schema.Types.ObjectId,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const StudyGroupSchema = new mongoose.Schema({
  subject: String,
  level: String, // "podstawa", "rozszerzenie", "zawodowy"
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

// Rejestracja
app.post('/api/register', async (req, res) => {
  const { email, password, name, subjectsBasic, subjectsExtended, subjectsVocational } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Brak danych' });
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Użytkownik istnieje' });
    const passwordHash = await bcrypt.hash(password, 10);
    const isMentor = subjectsExtended.length > 0 || subjectsVocational.length > 0;
    const user = new User({ email, passwordHash, name, isMentor, subjectsBasic, subjectsExtended, subjectsVocational });
    await user.save();
    res.json({ message: 'Zarejestrowano' });
  } catch (e) {
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// Logowanie
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Niepoprawne dane' });
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return res.status(400).json({ error: 'Niepoprawne dane' });
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, userId: user._id, name: user.name, isMentor: user.isMentor });
});

// Pobierz profil
app.get('/api/profile', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select('-passwordHash');
  res.json(user);
});

// Pobierz mentorów wg przedmiotu i poziomu
app.get('/api/mentors', authMiddleware, async (req, res) => {
  const { subject, level } = req.query;
  if (!subject || !level) return res.status(400).json({ error: 'Brak subject lub level' });

  // Mentorzy to użytkownicy, którzy mają ten przedmiot w rozszerzeniach (rozszerzenie)
  // lub w zawodowych (jeśli level = zawodowy)
  let query = {};
  if (level === 'rozszerzenie') {
    query = { isMentor: true, subjectsExtended: subject };
  } else if (level === 'zawodowy') {
    query = { isMentor: true, subjectsVocational: subject };
  } else {
    // podstawa - nie mentorzy, ale też pokażemy mentorów od rozszerzeń dla tego przedmiotu, żeby mogli pomóc
    query = { isMentor: true, $or: [{ subjectsExtended: subject }, { subjectsVocational: subject }] };
  }

  const mentors = await User.find(query).select('name subjectsBasic subjectsExtended subjectsVocational');
  res.json(mentors);
});

// Wysyłanie wiadomości (czat 1:1)
app.post('/api/messages', authMiddleware, async (req, res) => {
  const { toUserId, content } = req.body;
  if (!toUserId || !content) return res.status(400).json({ error: 'Brak treści lub odbiorcy' });
  const msg = new Message({ fromUserId: req.userId, toUserId, content });
  await msg.save();
  res.json({ message: 'Wysłano' });
});

// Pobierz historię czatu z danym użytkownikiem
app.get('/api/messages/:userId', authMiddleware, async (req, res) => {
  const otherId = req.params.userId;
  const msgs = await Message.find({
    $or: [
      { fromUserId: req.userId, toUserId: otherId },
      { fromUserId: otherId, toUserId: req.userId },
    ],
  }).sort('timestamp');
  res.json(msgs);
});

// Pobierz study groups (lista grup przedmiotów)
app.get('/api/studygroups', authMiddleware, async (req, res) => {
  const groups = await StudyGroup.find();
  res.json(groups);
});

// Dodaj użytkownika do grupy (study group)
app.post('/api/studygroups/join', authMiddleware, async (req, res) => {
  const { subject, level } = req.body;
  let group = await StudyGroup.findOne({ subject, level });
  if (!group) {
    group = new StudyGroup({ subject, level, members: [] });
  }
  if (!group.members.includes(req.userId)) {
    group.members.push(req.userId);
    await group.save();
  }
  res.json({ message: 'Dołączono do grupy' });
});

// Serwer start
const PORT = 4000;
app.listen(PORT, () => console.log('Server działa na porcie', PORT));
