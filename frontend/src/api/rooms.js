// src/api/rooms.js

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export async function fetchRooms(token) {
  const res = await fetch(`${API_URL}/rooms`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Nie udało się pobrać pokoi');
  }

  return res.json();
}

export async function fetchRoomMessages(roomId, token) {
  const res = await fetch(`${API_URL}/rooms/${roomId}/messages`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Nie udało się pobrać wiadomości');
  }

  return res.json();
}

export async function sendRoomMessage(roomId, content, token) {
  const res = await fetch(`${API_URL}/rooms/${roomId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Nie udało się wysłać wiadomości');
  }

  return res.json();
}
