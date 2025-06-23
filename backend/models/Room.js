// backend/models/Room.js
const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subject: { type: String, required: true },
  level: { type: String, enum: ['podstawowy', 'rozszerzony'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);