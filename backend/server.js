// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const mentorsRoutes = require('./routes/mentors');
const teachersRoutes = require('./routes/teachers');
const chatroomRoutes = require('./routes/chatrooms');

const { setupSocket } = require('./sockets');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://peerx.netlify.app', 'http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: ['https://peerx.netlify.app', 'http://localhost:3000'] }));
app.use(express.json());

// API routes
app.use('/api', authRoutes);
app.use('/api', profileRoutes);
app.use('/api', mentorsRoutes);
app.use('/api', teachersRoutes);
app.use('/api', chatroomRoutes);

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/peerxdb';
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Połączono z MongoDB');
  setupSocket(io);
  server.listen(4000, () => console.log('Serwer działa na porcie 4000'));
});