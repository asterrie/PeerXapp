import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';

const API = 'http://localhost:4000/api';

const AuthContext = createContext();

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Błąd sieci');
  }
  return res.json();
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    fetchJson(`${API}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(setUser)
      .catch(() => {
        setToken(null);
        localStorage.removeItem('token');
        setUser(null);
      });
  }, [token]);

  const login = useCallback((newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

function RequireAuth({ children }) {
  const auth = useAuth();
  if (!auth.token) return <Navigate to="/login" />;
  return children;
}

function CheckboxGroup({ items, selectedItems, setSelectedItems, label }) {
  const toggle = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  return (
    <div>
      <h3>{label}</h3>
      <div style={styles.checkboxGroup}>
        {items.map(item => (
          <label key={item} style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={selectedItems.includes(item)}
              onChange={() => toggle(item)}
            />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
}

function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [subjectsBasic, setSubjectsBasic] = useState([]);
  const [subjectsExtended, setSubjectsExtended] = useState([]);
  const [subjectsVocational, setSubjectsVocational] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const allBasicSubjects = ['Matematyka', 'Fizyka', 'Chemia', 'Biologia', 'Historia', 'Język polski', 'Angielski'];
  const allVocationalSubjects = ['Technologia informacyjna', 'Elektronika', 'Mechanika', 'Budownictwo'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError('Wypełnij wymagane pola');
      return;
    }
    try {
      await fetchJson(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, subjectsBasic, subjectsExtended, subjectsVocational }),
      });
      alert('Zarejestrowano, możesz się zalogować');
      navigate('/login');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Rejestracja</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input placeholder="Imię" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Hasło" type="password" value={password} onChange={e => setPassword(e.target.value)} required />

        <CheckboxGroup
          items={allBasicSubjects}
          selectedItems={subjectsBasic}
          setSelectedItems={setSubjectsBasic}
          label="Przedmioty podstawowe"
        />

        <CheckboxGroup
          items={allBasicSubjects}
          selectedItems={subjectsExtended}
          setSelectedItems={setSubjectsExtended}
          label="Przedmioty rozszerzone (będziesz mentorem)"
        />

        <CheckboxGroup
          items={allVocationalSubjects}
          selectedItems={subjectsVocational}
          setSelectedItems={setSubjectsVocational}
          label="Przedmioty zawodowe (technicy)"
        />

        <button type="submit">Zarejestruj się</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>Masz już konto? <Link to="/login">Zaloguj się</Link></p>
      </form>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchJson(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      auth.login(data.token);
      navigate('/');
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Logowanie</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Hasło" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Zaloguj się</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>Nie masz konta? <Link to="/register">Zarejestruj się</Link></p>
      </form>
    </div>
  );
}

function Dashboard() {
  const auth = useAuth();
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('podstawa');
  const [mentors, setMentors] = useState([]);
  const [chatUser, setChatUser] = useState(null);

  const allSubjects = ['Matematyka', 'Fizyka', 'Chemia', 'Biologia', 'Historia', 'Język polski', 'Angielski', 'Technologia informacyjna', 'Elektronika', 'Mechanika', 'Budownictwo'];

  useEffect(() => {
    if (!subject) {
      setMentors([]);
      return;
    }
    fetchJson(`${API}/mentors?subject=${encodeURIComponent(subject)}&level=${level}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then(setMentors)
      .catch(err => {
        console.error('Błąd pobierania mentorów:', err);
        setMentors([]);
      });
  }, [subject, level, auth.token]);

  if (!auth.user) return <p>Ładowanie profilu...</p>;

  return (
    <div style={styles.container}>
      <h2>Witaj, {auth.user.name}!</h2>
      <button onClick={auth.logout}>Wyloguj się</button>

      <h3>Wybierz przedmiot i poziom</h3>
      <select value={subject} onChange={e => setSubject(e.target.value)}>
        <option value="">-- wybierz przedmiot --</option>
        {allSubjects.map(subj => <option key={subj} value={subj}>{subj}</option>)}
      </select>
      <select value={level} onChange={e => setLevel(e.target.value)}>
        <option value="podstawa">Podstawa</option>
        <option value="rozszerzenie">Rozszerzenie</option>
        <option value="zawodowy">Zawodowy</option>
      </select>

      <h3>Dostępni mentorzy</h3>
      {mentors.length === 0 && <p>Brak mentorów dla tego przedmiotu/poziomu</p>}
      <ul>
        {mentors.map(m => (
          <li key={m._id}>
            {m.name} — Mentoring w: {m.subjectsExtended.join(', ')} {m.subjectsVocational.length ? `(zawodowe: ${m.subjectsVocational.join(', ')})` : ''}
            <button onClick={() => setChatUser(m)} style={{ marginLeft: 10 }}>Rozpocznij sesję</button>
          </li>
        ))}
      </ul>

      {chatUser && <Chat user={chatUser} onClose={() => setChatUser(null)} />}
    </div>
  );
}

function Chat({ user, onClose }) {
  const auth = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!user) return;
    fetchJson(`${API}/messages/${user._id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
      .then(setMessages)
      .catch(err => console.error('Błąd pobierania wiadomości:', err));
  }, [user, auth.token]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      await fetchJson(`${API}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
        body: JSON.stringify({ toUserId: user._id, content: input }),
      });
      setMessages(prev => [...prev, { fromUserId: auth.user._id, toUserId: user._id, content: input, timestamp: new Date().toISOString() }]);
      setInput('');
    } catch (e) {
      alert('Błąd wysyłania wiadomości: ' + e.message);
    }
  };

  return (
    <div style={styles.chatOverlay}>
      <div style={styles.chatWindow}>
        <button onClick={onClose} style={styles.closeBtn}>X</button>
        <h3>Sesja z {user.name}</h3>
        <div style={styles.chatMessages}>
          {messages.map((m, i) => (
            <div key={i} style={m.fromUserId === auth.user._id ? styles.myMessage : styles.theirMessage}>
              <span>{m.content}</span>
              <br />
              <small>{new Date(m.timestamp).toLocaleTimeString()}</small>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Napisz wiadomość..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
          style={styles.chatInput}
          autoFocus
        />
        <button onClick={sendMessage}>Wyślij</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: '2rem auto',
    padding: '1rem',
    backgroundColor: '#0d1a40',
    color: 'white',
    borderRadius: 8,
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  checkboxGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 10,
  },
  chatOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  chatWindow: {
    backgroundColor: '#1a2b5c',
    padding: '1rem',
    borderRadius: 8,
    width: 400,
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: 20,
    cursor: 'pointer',
  },
  chatMessages: {
    flexGrow: 1,
    overflowY: 'auto',
    marginBottom: 10,
  },
  myMessage: {
    backgroundColor: '#0f8b5f',
    padding: 6,
    borderRadius: 6,
    alignSelf: 'flex-end',
    marginBottom: 6,
    maxWidth: '80%',
  },
  theirMessage: {
    backgroundColor: '#444c6e',
    padding: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
    maxWidth: '80%',
  },
  chatInput: {
    padding: 8,
    borderRadius: 4,
    border: 'none',
    marginBottom: 6,
  },
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
