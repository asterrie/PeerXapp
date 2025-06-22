// sockets/index.js
const Message = require('../models/Message');

function setupSocket(io) {
  io.on('connection', (socket) => {
    console.log('Użytkownik połączony:', socket.id);

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} dołączył do pokoju ${roomId}`);
    });

    socket.on('sendMessage', async ({ roomId, text, sender }) => {
      const message = await Message.create({ roomId, text, sender });
      io.to(roomId).emit('newMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('Użytkownik rozłączony:', socket.id);
    });
  });
}

module.exports = { setupSocket };

