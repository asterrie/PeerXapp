const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getRooms,
  createRoom,
  getRoomMessages,
  sendRoomMessage
} = require('../controllers/roomController');

router.get('/', authMiddleware, getRooms); // pobranie wszystkich pokoi
router.post('/', authMiddleware, createRoom); // utworzenie nowego pokoju
router.get('/:roomId/messages', authMiddleware, getRoomMessages); // pobranie wiadomości z pokoju
router.post('/:roomId/messages', authMiddleware, sendRoomMessage); // wysłanie wiadomości do pokoju

module.exports = router;
