const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const { getMessages, sendMessage } = require('../controllers/chatController');

router.get('/:userId', authMiddleware, getMessages); // wiadomości z konkretnym userem
router.post('/', authMiddleware, sendMessage);       // wysłanie wiadomości

module.exports = router;
