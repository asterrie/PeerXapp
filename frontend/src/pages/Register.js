import React, { useState } from 'react';

const API = process.env.REACT_APP_API_URL;

const allExtendedSubjects = ['Matematyka', 'Fizyka', 'Chemia', 'Biologia', 'Informatyka'];
const allVocationalSubjects = ['Programowanie', 'Mechanika', 'Elektronika', 'Ekonomia'];

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subjectsExtended, setSubjectsExtended] = useState([]);
  const [subjectsVocational, setSubjectsVocational] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (subjectsExtended.length === 0) {
      setError('Musisz wybrać co najmniej jeden przedmiot rozszerzony.');
      return;
    }

    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          subjectsExtended,
          subjectsVocational,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Błąd rejestracji');
      }
      setSuccess(true);
      setName('');
      setEmail('');
      setPassword('');
      setSubjectsExtended([]);
      setSubjectsVocational([]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '40px auto',
        padding: 30,
        backgroundColor: '#282c34',
        borderRadius: 12,
        color: '#eee',
      }}
    >
      <h2 style={{ color: '#61dafb' }}>Rejestracja</h2>
      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
      {success && <p style={{ color: '#6bcf6b' }}>Rejestracja zakończona sukcesem! Możesz się teraz zalogować.</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          type="text"
          placeholder="Imię"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label style={{ marginTop: 10 }}>Przedmioty rozszerzone (minimum 1):</label>
        <select
          multiple
          value={subjectsExtended}
          onChange={(e) =>
            setSubjectsExtended([...e.target.selectedOptions].map((o) => o.value))
          }
          size={allExtendedSubjects.length}
          required
        >
          {allExtendedSubjects.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>

        <label style={{ marginTop: 10 }}>Przedmioty zawodowe:</label>
        <select
          multiple
          value={subjectsVocational}
          onChange={(e) =>
            setSubjectsVocational([...e.target.selectedOptions].map((o) => o.value))
          }
          size={allVocationalSubjects.length}
        >
          {allVocationalSubjects.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>

        <button type="submit" style={{ marginTop: 20 }}>
          Zarejestruj się
        </button>
      </form>
      <p style={{ marginTop: 10 }}>
        Masz już konto? <a href="/login" style={{ color: '#61dafb' }}>Zaloguj się</a>
      </p>
    </div>
  );
}
