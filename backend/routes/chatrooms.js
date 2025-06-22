// routes/chatrooms.js
const express = require('express');
const StudyGroup = require('../models/StudyGroup');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/chatrooms/:subject', authMiddleware, async (req, res) => {
  try {
    const rooms = await StudyGroup.find({ subject: req.params.subject });
    res.json(rooms);
  } catch (e) {
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

router.post('/chatrooms', authMiddleware, async (req, res) => {
  const { subject, level } = req.body;
  try {
    const group = new StudyGroup({ subject, level, members: [req.userId] });
    await group.save();
    res.status(201).json(group);
  } catch (e) {
    res.status(500).json({ error: 'Błąd tworzenia pokoju' });
  }
});

router.get('/messages/:roomId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).populate('sender', 'name');
    res.json(messages);
  } catch (e) {
    res.status(500).json({ error: 'Błąd pobierania wiadomości' });
  }
});

module.exports = router;
