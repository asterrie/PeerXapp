const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();

app.use(cors({
  origin: ['https://peerx.netlify.app', 'http://localhost:3000']
}));
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const roomRoutes = require('./routes/roomRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/rooms', roomRoutes);

const PORT = process.env.PORT || 4000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/peerxdb';

// Tworzymy serwer HTTP dla Express i Socket.io
const server = http.createServer(app);

// Inicjalizacja Socket.io
const io = new Server(server, {
  cors: {
    origin: ['https://peerx.netlify.app', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
  }
});

// Socket.io - obsługa połączeń
io.on('connection', (socket) => {
  console.log('Nowe połączenie Socket.io:', socket.id);

  // Przykład eventu: dołączanie do pokoju
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} dołączył do pokoju ${roomId}`);
  });

  // Możesz dodać kolejne eventy, np. wysyłanie wiadomości
  socket.on('sendMessage', ({ roomId, message }) => {
    // Emitujemy wiadomość do wszystkich w pokoju oprócz nadawcy
    socket.to(roomId).emit('receiveMessage', { message, senderId: socket.id });
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} rozłączył się`);
  });
});

// Połączenie z MongoDB i start serwera
mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Połączono z MongoDB');
    server.listen(PORT, () => {
      console.log(`Serwer działa na porcie ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Błąd połączenia z MongoDB:', err);
  });
