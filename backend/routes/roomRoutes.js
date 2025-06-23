// backend/routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getRooms,
  createRoom,
  getRoomMessages,
  sendRoomMessage
} = require('../controllers/roomController');

router.get('/', authMiddleware, getRooms);
router.post('/', authMiddleware, createRoom);
router.get('/:roomId/messages', authMiddleware, getRoomMessages);
router.post('/:roomId/messages', authMiddleware, sendRoomMessage);

module.exports = router;