/ backend/controllers/chatController.js
const Message = require('../models/Message');

exports.getPrivateMessages = async (req, res) => {
  const { userId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { fromUserId: req.userId, toUserId: userId },
        { fromUserId: userId, toUserId: req.userId },
      ],
    }).sort('timestamp');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Błąd pobierania wiadomości prywatnych' });
  }
};

exports.sendPrivateMessage = async (req, res) => {
  const { userId } = req.params;
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Brak treści wiadomości' });

  try {
    const message = new Message({ fromUserId: req.userId, toUserId: userId, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: 'Błąd wysyłania wiadomości prywatnej' });
  }
};