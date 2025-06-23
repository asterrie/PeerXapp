const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/peerxdb');
    console.log('Połączono z MongoDB');
  } catch (err) {
    console.error('Błąd połączenia z MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
