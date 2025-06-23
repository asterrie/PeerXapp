const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const regex = new RegExp(q, 'i');
    const users = await User.find({
      name: regex
    }).select('-passwordHash');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

exports.sendFriendRequest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    if (!targetUserId) return res.status(400).json({ error: 'Brak targetUserId' });

    if (req.userId === targetUserId) return res.status(400).json({ error: 'Nie możesz dodać siebie' });

    const user = await User.findById(req.userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) return res.status(404).json({ error: 'Użytkownik nie znaleziony' });

    if (user.friends.includes(targetUserId)) return res.status(400).json({ error: 'Jesteście już znajomymi' });

    if (user.friendRequestsSent.includes(targetUserId)) {
      return res.status(400).json({ error: 'Już wysłałeś zaproszenie' });
    }

    user.friendRequestsSent.push(targetUserId);
    targetUser.friendRequestsReceived.push(req.userId);

    await user.save();
    await targetUser.save();

    res.json({ message: 'Zaproszenie wysłane' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const { requesterId } = req.body;
    if (!requesterId) return res.status(400).json({ error: 'Brak requesterId' });

    const user = await User.findById(req.userId);
    const requester = await User.findById(requesterId);

    if (!requester) return res.status(404).json({ error: 'Użytkownik nie znaleziony' });

    if (!user.friendRequestsReceived.includes(requesterId)) {
      return res.status(400).json({ error: 'Brak zaproszenia od tego użytkownika' });
    }

    // Dodajemy się do znajomych
    user.friends.push(requesterId);
    requester.friends.push(req.userId);

    // Usuwamy zaproszenia
    user.friendRequestsReceived = user.friendRequestsReceived.filter(id => id.toString() !== requesterId);
    requester.friendRequestsSent = requester.friendRequestsSent.filter(id => id.toString() !== req.userId);

    await user.save();
    await requester.save();

    res.json({ message: 'Zaproszenie zaakceptowane' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

exports.getFriendsList = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friends', 'name email role');
    res.json(user.friends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const user = await User.findById(req.userId);
    const friend = await User.findById(friendId);

    if (!friend) return res.status(404).json({ error: 'Znajomy nie znaleziony' });

    user.friends = user.friends.filter(id => id.toString() !== friendId);
    friend.friends = friend.friends.filter(id => id.toString() !== req.userId);

    await user.save();
    await friend.save();

    res.json({ message: 'Znajomy usunięty' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Błąd serwera' });
  }
};
