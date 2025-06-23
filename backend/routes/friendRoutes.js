// backend/routes/friendRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getFriends,
  addFriend
} = require('../controllers/friendController');

router.get('/', authMiddleware, getFriends);
router.post('/', authMiddleware, addFriend);

module.exports = router;