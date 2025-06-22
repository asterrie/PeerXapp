// models/StudyGroup.js
const mongoose = require('mongoose');

const StudyGroupSchema = new mongoose.Schema({
  subject: String,
  level: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('StudyGroup', StudyGroupSchema);
