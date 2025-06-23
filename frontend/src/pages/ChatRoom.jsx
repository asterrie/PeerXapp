import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/apiClient';

export default function ChatRoom() {
  const { token, user } = useAuth();
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchRoomData = async () => {
      try {
        // Pobierz informacje o pokoju (można rozbudować jeśli potrzebne)
        const rooms = await apiFetch('/rooms', 'GET', token);
        const foundRoom = rooms.find(r => r._id === roomId);
        if (!foundRoom) {
          setError('Pokój nie istnieje.');
          return;
        }
        setRoom(foundRoom);

        // Pobierz wiadomości z pokoju
        const msgs = await apiFetch(`/rooms/${roomId}/messages`, 'GET', token);
        setMessages(msgs);
      } catch (e) {
        setError(e.message || 'Błąd ładowania pokoju');
      }
    };
    fetchRoomData();
  }, [roomId, token, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    try {
      const sentMessage = await apiFetch(
        `/rooms/${roomId}/messages`,
        'POST',
        token,
        { content: newMsg.trim() }
      );
      setMessages(prev => [...prev, sentMessage]);
      setNewMsg('');
    } catch (e) {
      setError(e.message || 'Błąd wysyłania wiadomości');
    }
  };

  if (error) return <div style={{ color: 'red', maxWidth: 600, margin: '20px auto' }}>{error}</div>;
  if (!room) return <p style={{ maxWidth: 600, margin: '20px auto' }}>Ładowanie pokoju...</p>;

  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <h2>Pokój: {room.name}</h2>
      <div
        style={{
          height: 400,
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: 10,
          marginBottom: 10,
          backgroundColor: '#fafafa',
        }}
      >
        {messages.length === 0 ? (
          <p>Brak wiadomości w pokoju.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} style={{ marginBottom: 8 }}>
              <strong>{msg.fromUserId === user._id ? 'Ty' : msg.fromUserName || 'Użytkownik'}:</strong>{' '}
              {msg.content}
              <br />
              <small style={{ color: '#666' }}>{new Date(msg.timestamp).toLocaleString()}</small>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: 10 }}>
        <input
          type="text"
          placeholder="Napisz wiadomość..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          style={{ flexGrow: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>
          Wyślij
        </button>
      </form>
      <button onClick={() => navigate('/student-panel')} style={{ marginTop: 20 }}>
        Powrót do panelu ucznia
      </button>
    </div>
  );
}
