const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
  content: { type: String, required: true },
  type: { type: String, enum: ['private', 'room'], required: true },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
