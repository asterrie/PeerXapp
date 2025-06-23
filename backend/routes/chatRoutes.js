// backend/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getPrivateMessages,
  sendPrivateMessage
} = require('../controllers/chatController');

router.get('/:userId', authMiddleware, getPrivateMessages);
router.post('/:userId', authMiddleware, sendPrivateMessage);