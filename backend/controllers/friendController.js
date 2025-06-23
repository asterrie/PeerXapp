// backend/controllers/friendController.js
const User = require('../models/User');

exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friends', 'name email');
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ error: 'Błąd pobierania listy znajomych' });
  }
};

exports.addFriend = async (req, res) => {
  const { friendId } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save();
    }
    res.json({ message: 'Dodano znajomego' });
  } catch (err) {
    res.status(500).json({ error: 'Błąd dodawania znajomego' });
  }
};