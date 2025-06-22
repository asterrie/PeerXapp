import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { styles } from './components/styles';
import fetchJson from './utils/fetchJson';

const API = process.env.REACT_APP_API_URL;

export default function MentorPicker() {
  const auth = useAuth();
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('podstawa');
  const [mentors, setMentors] = useState([]);

  const allSubjects = ['Matematyka', 'Fizyka', 'Chemia', 'Biologia', 'Historia', 'Język polski', 'Angielski', 'Informatyka'];

  useEffect(() => {
    if (!subject) return setMentors([]);
    fetchJson(`${API}/mentors?subject=${encodeURIComponent(subject)}&level=${level}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    }).then(setMentors).catch(() => setMentors([]));
  }, [subject, level, auth.token]);

  return (
    <div>
      <h3>Wybierz mentora</h3>
      <select value={subject} onChange={e => setSubject(e.target.value)} style={styles.select}>
        <option value="">-- Przedmiot --</option>
        {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <select value={level} onChange={e => setLevel(e.target.value)} style={styles.select}>
        <option value="podstawa">Podstawa</option>
        <option value="rozszerzenie">Rozszerzenie</option>
        <option value="zawodowy">Zawodowy</option>
      </select>
      <ul style={styles.list}>
        {mentors.map(m => (
          <li key={m._id} style={styles.listItem}>
            <button onClick={() => window.location.hash = `#/chat/${m._id}`}>{m.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
