const Room = require('../models/Room');
const Message = require('../models/Message');

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { name, subject, level } = req.body;
    if (!name || !subject || !level) return res.status(400).json({ error: 'Brak danych' });

    const room = new Room({ name, subject, level });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

exports.getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId }).sort('timestamp');
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

exports.sendRoomMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Brak treści' });

    const message = new Message({
      fromUserId: req.userId,
      roomId,
      content
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};
