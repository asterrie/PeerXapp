import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import fetchJson from '../utils/fetchJson';

const API = process.env.REACT_APP_API_URL;

const authStyles = {
  container: {
    maxWidth: 400,
    margin: '40px auto',
    padding: 30,
    backgroundColor: '#282c34',
    borderRadius: 12,
    boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
    color: '#eee',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: 'center',
  },
  title: { marginBottom: 20, fontWeight: '700', fontSize: 28, color: '#61dafb' },
  form: { display: 'flex', flexDirection: 'column', gap: 15 },
  label: { textAlign: 'left', fontWeight: '600', fontSize: 14 },
  input: {
    padding: '10px 15px',
    fontSize: 16,
    borderRadius: 6,
    border: '1.5px solid #444',
    backgroundColor: '#1f242c',
    color: '#eee',
    outline: 'none',
  },
  button: {
    marginTop: 10,
    padding: '12px',
    fontSize: 18,
    fontWeight: '600',
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#61dafb',
    color: '#222',
    cursor: 'pointer',
    boxShadow: '0 5px 12px rgba(97, 218, 251, 0.6)',
  },
  error: { color: '#ff6b6b', fontWeight: '600', marginBottom: 10 },
  switchText: { marginTop: 20, fontSize: 14, color: '#bbb' },
  link: { color: '#61dafb', textDecoration: 'none', fontWeight: '600' },
};

export default function Login() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await fetchJson(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      auth.login(data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={authStyles.container}>
      <h2 style={authStyles.title}>Logowanie</h2>
      {error && <p style={authStyles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={authStyles.form}>
        <label style={authStyles.label}>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={authStyles.input}
          placeholder="wpisz swój email"
        />
        <label style={authStyles.label}>Hasło:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={authStyles.input}
          placeholder="wpisz hasło"
        />
        <button type="submit" style={authStyles.button}>Zaloguj się</button>
      </form>
      <p style={authStyles.switchText}>
        Nie masz konta? <a href="/register" style={authStyles.link}>Zarejestruj się</a>
      </p>
    </div>
  );
}
