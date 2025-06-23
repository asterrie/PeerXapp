const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getProfile,
  getAllUsers,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  getFriendsList,
  removeFriend
} = require('../controllers/userController');

router.get('/profile', authMiddleware, getProfile);
router.get('/all', authMiddleware, getAllUsers);
router.get('/search', authMiddleware, searchUsers);

router.post('/friends/request', authMiddleware, sendFriendRequest);
router.post('/friends/accept', authMiddleware, acceptFriendRequest);
router.get('/friends', authMiddleware, getFriendsList);
router.delete('/friends/:friendId', authMiddleware, removeFriend);

module.exports = router;
