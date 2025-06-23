// backend/server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const seedRooms = require('./config/seedrooms');
const mongoose = require('mongoose'); // ⬅️ potrzebne do sprawdzenia połączenia

dotenv.config();
const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://peerx.netlify.app'],
  credentials: true
}));
app.use(express.json());

// Trasy
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://peerx.netlify.app'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.io
io.on('connection', (socket) => {
  console.log('🔌 Nowe połączenie Socket.io:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
  });

  socket.on('sendMessage', ({ roomId, message }) => {
    socket.to(roomId).emit('receiveMessage', { message, senderId: socket.id });
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket ${socket.id} rozłączył się`);
  });
});

// 🧠 Połączenie z MongoDB i start serwera
const PORT = process.env.PORT || 4000;

connectDB()
  .then(async () => {
    console.log('✅ Połączono z MongoDB');

    await seedRooms(); // 🔁 Utwórz pokoje jeśli nie istnieją

    server.listen(PORT, () => {
      console.log(`🚀 Serwer działa na porcie ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Błąd połączenia z MongoDB:', err);
    process.exit(1);
  });
