import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

export default function StudentPanel() {
  const { token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchUserAndRooms = async () => {
      try {
        const user = await apiFetch('/users/me', 'GET', token);
        setUserData(user);

        const roomsList = await apiFetch('/rooms', 'GET', token);
        setRooms(roomsList);
      } catch (e) {
        setError(e.message || 'Błąd ładowania danych');
      }
    };
    fetchUserAndRooms();
  }, [token, navigate]);

  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!userData) return <p>Ładowanie danych użytkownika...</p>;

  return (
    <div style={{ maxWidth: 600, margin: '20px auto' }}>
      <h2>Witaj, {userData.name}!</h2>
      <p>Twoja rola: {userData.role}</p>
      <p><strong>Przedmioty rozszerzone:</strong> {userData.subjectsExtended?.join(', ') || 'Brak'}</p>

      <h3>Dostępne pokoje czatu:</h3>
      {rooms.length === 0 ? (
        <p>Brak dostępnych pokoi.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {rooms.map((room) => (
            <li key={room._id} style={{ marginBottom: 10 }}>
              <button
                onClick={() => navigate(`/chatroom/${room._id}`)}
                style={{ padding: '8px 12px', cursor: 'pointer' }}
              >
                {room.name} — {room.subject} ({room.level})
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
