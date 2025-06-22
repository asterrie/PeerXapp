// src/pages/StudentChatList.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchJson } from '../utils/fetchJson';
import { useNavigate } from 'react-router-dom';

function StudentChatList() {
  const { user, token } = useAuth();
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    // Pobierz listę uczniów z tymi samymi przedmiotami rozszerzonymi/zawodowymi
    const subjects = [...(user.subjectsExtended || []), ...(user.subjectsVocational || [])];
    if (subjects.length === 0) return;

    // Pobierz uczniów dopasowanych do któregokolwiek przedmiotu
    const promises = subjects.map(subj =>
      fetchJson(`${process.env.REACT_APP_API_URL}/users?subject=${encodeURIComponent(subj)}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );

    Promise.all(promises).then(results => {
      const combined = results.flat();
      // Usuń siebie z listy
      const filtered = combined.filter(s => s._id !== user._id);
      // Unikat po _id
      const unique = Array.from(new Map(filtered.map(s => [s._id, s])).values());
      setStudents(unique);
    }).catch(() => setStudents([]));
  }, [user, token]);

  return (
    <div>
      <h3>Uczniowie do rozmowy</h3>
      {students.length === 0 && <p>Brak dostępnych uczniów do czatu.</p>}
      <ul>
        {students.map(s => (
          <li key={s._id}>
            <button onClick={() => navigate(`/chat/user/${s._id}`)}>{s.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentChatList;
