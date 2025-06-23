// backend/controllers/userController.js
const User = require('../models/User');

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Nie znaleziono użytkownika' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Błąd serwera przy pobieraniu danych użytkownika' });
  }
};