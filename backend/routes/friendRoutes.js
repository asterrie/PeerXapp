const express = require('express');
const router = express.Router();
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  getFriendRequests,
} = require('../controllers/friendController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/request/:toUserId', authMiddleware, sendFriendRequest);
router.post('/accept/:requestId', authMiddleware, acceptFriendRequest);
router.post('/reject/:requestId', authMiddleware, rejectFriendRequest);
router.get('/', authMiddleware, getFriends);
router.get('/requests', authMiddleware, getFriendRequests);

module.exports = router;
