// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { getCurrentUser } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
