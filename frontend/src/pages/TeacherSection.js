import React, { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import fetchJson from './utils/fetchJson';
import { styles } from './components/styles';

const API = process.env.REACT_APP_API_URL;

export default function TeacherSection() {
  const auth = useAuth();
  const [expanded, setExpanded] = useState(null);
  const [teachers, setTeachers] = useState([]);

  const categories = {
    podstawowe: ['Matematyka', 'Fizyka'],
    rozszerzone: ['Chemia', 'Biologia'],
  };

  useEffect(() => {
    fetchJson(`${API}/teachers`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    }).then(setTeachers);
  }, [auth.token]);

  return (
    <div>
      <h3>Nauczyciele</h3>
      // Po <h3>Nauczyciele</h3>
<h4>Utwórz nowy pokój</h4>
<form onSubmit={handleCreateRoom}>
  <input
    type="text"
    placeholder="Nazwa pokoju"
    value={newRoom.name}
    onChange={e => setNewRoom({ ...newRoom, name: e.target.value })}
    required
  />
  <select
    value={newRoom.subject}
    onChange={e => setNewRoom({ ...newRoom, subject: e.target.value })}
  >
    <option value="">Wybierz przedmiot</option>
    {Object.values(categories).flat().map(s => (
      <option key={s} value={s}>{s}</option>
    ))}
  </select>
  <button type="submit">Dodaj</button>
</form>
      {Object.entries(categories).map(([cat, subs]) => (
        <div key={cat}>
          <h4 onClick={() => setExpanded(expanded === cat ? null : cat)} style={styles.expand}>{cat}</h4>
          {expanded === cat && subs.map(sub => {
            const list = teachers.filter(t => t.subjectsExtended.includes(sub));
            return (
              <div key={sub}>
                <strong>{sub}</strong>
                <ul>
                  {list.map(t => (
                    <li key={t._id}>
                      <button onClick={() => window.location.hash = `#/chat/${t._id}`}>{t.name}</button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
