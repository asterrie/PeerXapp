// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: String,
  name: String,
  isMentor: { type: Boolean, default: false },
  tokens: { type: Number, default: 0 },
  subjectsBasic: [String],
  subjectsExtended: [String],
  subjectsVocational: [String],
});

module.exports = mongoose.model('User', UserSchema);