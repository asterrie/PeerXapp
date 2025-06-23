// frontend/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/apiClient';

const SUBJECTS = [
    'Matematyka',
    'Fizyka',
    'Chemia',
    'Informatyka',
    'Biologia',
    'Historia',
    'Język polski',
    'Język angielski',
    'Wiedza o społeczeństwie',
    'Język Niemiecki', 
    'Język hiszpański', 
    'Geografia'
];

export default function Register() {
  const { setUser, setToken } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    subjectsExtended: []
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => {
        const updated = checked
          ? [...prev.subjectsExtended, value]
          : prev.subjectsExtended.filter((s) => s !== value);
        return { ...prev, subjectsExtended: updated };
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await apiFetch('/auth/register', 'POST', null, form);
      setToken(data.token);
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>Rejestracja</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Imię i nazwisko"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Hasło"
          value={form.password}
          onChange={handleChange}
          required
        />

        <fieldset>
          <legend>Przedmioty rozszerzone</legend>
          {SUBJECTS.map((subject) => (
            <label key={subject} style={{ display: 'block' }}>
              <input
                type="checkbox"
                name="subjectsExtended"
                value={subject}
                checked={form.subjectsExtended.includes(subject)}
                onChange={handleChange}
              />
              {subject}
            </label>
          ))}
        </fieldset>

        <button type="submit">Zarejestruj się</button>
      </form>
      <p>
        Masz już konto? <Link to="/login">Zaloguj się</Link>
      </p>
    </div>
  );
}
