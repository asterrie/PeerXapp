const Message = require('../models/Message');

// Pobierz prywatne wiadomości między dwoma użytkownikami
exports.getPrivateMessages = async (req, res) => {
  try {
    const { userId } = req.params; // drugi użytkownik
    const myId = req.userId;       // aktualnie zalogowany użytkownik

    const messages = await Message.find({
      type: 'private',
      $or: [
        { fromUserId: myId, toUserId: userId },
        { fromUserId: userId, toUserId: myId }
      ]
    }).sort('timestamp');

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

// Wyślij prywatną wiadomość
exports.sendPrivateMessage = async (req, res) => {
  try {
    const { toUserId, content } = req.body;
    if (!toUserId || !content) return res.status(400).json({ error: 'Brak danych' });

    const message = new Message({
      fromUserId: req.userId,
      toUserId,
      content,
      type: 'private'
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

// Pobierz wszystkie wiadomości z pokoju
exports.getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({
      type: 'room',
      roomId
    }).sort('timestamp');

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

// Wyślij wiadomość do pokoju
exports.sendRoomMessage = async (req, res) => {
  try {
    const { roomId, content } = req.body;
    if (!roomId || !content) return res.status(400).json({ error: 'Brak danych' });

    const message = new Message({
      fromUserId: req.userId,
      roomId,
      content,
      type: 'room'
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};
