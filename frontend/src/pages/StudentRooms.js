import React, { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import fetchJson from '../utils/fetchJson';

const API = process.env.REACT_APP_API_URL;

export default function StudentRooms() {
  const auth = useAuth();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchJson(`${API}/rooms`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    }).then(setRooms).catch(() => setRooms([]));
  }, [auth.token]);

  return (
    <div>
      <h3>Lista dostępnych czatroomów</h3>
      <ul>
        {rooms.map(r => (
          <li key={r._id}>
            <strong>{r.subject}</strong>: <a href={`/chat/${r._id}`}>{r.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
