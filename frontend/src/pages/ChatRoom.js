// src/pages/ChatRoom.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { fetchJson } from '../utils/fetchJson';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000';
const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

let socket;

function ChatRoom() {
  const { roomId } = useParams();
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef();

  useEffect(() => {
    // connect to socket
    socket = io(SOCKET_URL);
    socket.emit('joinRoom', roomId);

    socket.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    fetchJson(`${API}/api/messages/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(setMessages).catch(() => setMessages([]));
  }, [roomId, token]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    socket.emit('sendMessage', { roomId, text, sender: user._id });
    setText('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Czatroom: {roomId}</h2>
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} style={styles.message}>
            <strong>{msg.sender?.name || 'Użytkownik'}:</strong> {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} style={styles.form}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Wpisz wiadomość..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Wyślij</button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: 600, margin: '20px auto', padding: 20, color: '#fff' },
  header: { fontSize: 24, marginBottom: 10 },
  messages: {
    background: '#333',
    padding: 10,
    height: 300,
    overflowY: 'auto',
    marginBottom: 10,
    borderRadius: 8,
  },
  message: { padding: '4px 0', borderBottom: '1px solid #444' },
  form: { display: 'flex', gap: 10 },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    border: '1px solid #666',
    backgroundColor: '#222',
    color: '#eee',
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#61dafb',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontWeight: 600,
  },
};

export default ChatRoom;
