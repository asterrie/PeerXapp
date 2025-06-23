import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import axios from '../api/apiClient';
import ChatMessages from '../components/ChatMessages';

const socket = io(import.meta.env.VITE_SOCKET_URL);

export default function Chatroom() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.emit('joinRoom', roomId);

    socket.on('receiveMessage', ({ message, senderId }) => {
      setMessages(prev => [...prev, { content: message, fromUserId: senderId }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get(`/rooms/${roomId}/messages`);
      setMessages(res.data);
    };
    fetchMessages();
  }, [roomId]);

  const handleSend = async () => {
    if (!message.trim()) return;
    await axios.post(`/rooms/${roomId}/messages`, { content: message });
    socket.emit('sendMessage', { roomId, message });
    setMessage('');
  };

  return (
    <div>
      <h2>Pokój: {roomId}</h2>
      <ChatMessages messages={messages} userId={user._id} />
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSend}>Wyślij</button>
    </div>
  );
}
