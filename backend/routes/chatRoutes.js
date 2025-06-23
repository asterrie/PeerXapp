const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const chatController = require('../controllers/chatController');

// 💬 WIADOMOŚCI PRYWATNE (uczeń ↔ uczeń)
router.get('/private/:userId', authMiddleware, chatController.getPrivateMessages);
router.post('/private', authMiddleware, chatController.sendPrivateMessage);

// 🧑‍🏫 WIADOMOŚCI W POKOJACH (czatroomy)
router.get('/room/:roomId', authMiddleware, chatController.getRoomMessages);
router.post('/room', authMiddleware, chatController.sendRoomMessage);

module.exports = router;
