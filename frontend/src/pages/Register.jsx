import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/apiClient';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', email: '', password: '', role: 'student', subjects: []
  });

  const handleSubmit = async e => {
    e.preventDefault();
    await axios.post('/auth/register', form);
    navigate('/login');
  };

  const subjectOptions = ['Matematyka', 'Biologia', 'Geografia', 'Zawodowe IT', 'Język Polski'];

  const toggleSubject = subject => {
    setForm(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Rejestracja</h2>
      <input
        placeholder="Nazwa użytkownika"
        value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })}
      />
      <input
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Hasło"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <select onChange={e => setForm({ ...form, role: e.target.value })}>
        <option value="student">Uczeń</option>
        <option value="teacher">Nauczyciel</option>
      </select>

      {form.role === 'student' && (
        <div>
          <p>Wybierz przedmioty, w których chcesz być mentorem:</p>
          {subjectOptions.map(subject => (
            <label key={subject}>
              <input
                type="checkbox"
                checked={form.subjects.includes(subject)}
                onChange={() => toggleSubject(subject)}
              />
              {subject}
            </label>
          ))}
        </div>
      )}

      <button type="submit">Zarejestruj</button>
    </form>
  );
}
