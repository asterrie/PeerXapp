import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;
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
    if (!token) return setUser(null);
    fetchJson(`${API}/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(setUser).catch(() => { setToken(null); localStorage.removeItem('token'); setUser(null); });
  }, [token]);

  const login = useCallback(t => { setToken(t); localStorage.setItem('token', t); }, []);
  const logout = useCallback(() => { setToken(null); setUser(null); localStorage.removeItem('token'); }, []);

  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
function RequireAuth({ children }) {
  const auth = useAuth();
  if (!auth.token) return <Navigate to="/login" />;
  return children;
}

// Tab navigation component
function Tabs({ active, setActive }) {
  return (
    <div style={styles.tabBar}>
      <button style={active === 'students' ? styles.tabActive : styles.tab} onClick={() => setActive('students')}>Uczniowie</button>
      <button style={active === 'teachers' ? styles.tabActive : styles.tab} onClick={() => setActive('teachers')}>Nauczyciele</button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<RequireAuth><Dashboard /></RequireAuth>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function Dashboard() {
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState('students');

  if (!auth.user) return <p>Ładowanie profilu...</p>;

  return (
    <div style={styles.container}>
      <h2>Witaj, {auth.user.name}!</h2>
      <button onClick={auth.logout} style={styles.logout}>Wyloguj się</button>
      <Tabs active={activeTab} setActive={setActiveTab} />
      {activeTab === 'students' ? <StudentSection /> : <TeacherSection />}
    </div>
  );
}

// Uczniowie: wybór mentora i czatroomy
function StudentSection() {
  const [section, setSection] = useState('mentor');
  return (
    <>
      <div style={styles.subTabBar}>
        <button style={section==='mentor'?styles.subTabActive:styles.subTab} onClick={()=>setSection('mentor')}>Wybierz mentora</button>
        <button style={section==='rooms'?styles.subTabActive:styles.subTab} onClick={()=>setSection('rooms')}>Czatroomy</button>
      </div>
      {section==='mentor' ? <MentorPicker /> : <StudentRooms />}
    </>
  );
}

function MentorPicker() {
  const auth = useAuth();
  const [subject, setSubject] = useState('');
  const [level, setLevel] = useState('podstawa');
  const [mentors, setMentors] = useState([]);
  const allSubjects = ['Matematyka','Fizyka','Chemia','Biologia','Historia','Język polski','Angielski','Informatyka'];
  useEffect(()=>{
    if(!subject) return setMentors([]);
    fetchJson(`${API}/mentors?subject=${encodeURIComponent(subject)}&level=${level}`,{headers:{Authorization:`Bearer ${auth.token}`}})
      .then(setMentors).catch(()=>setMentors([]));
  },[subject,level,auth.token]);
  return (
    <div>
      <h3>Wybierz mentora</h3>
      <select value={subject} onChange={e=>setSubject(e.target.value)} style={styles.select}>
        <option value="">-- Przedmiot --</option>
        {allSubjects.map(s=><option key={s} value={s}>{s}</option>)}
      </select>
      <select value={level} onChange={e=>setLevel(e.target.value)} style={styles.select}>
        <option value="podstawa">Podstawa</option>
        <option value="rozszerzenie">Rozszerzenie</option>
        <option value="zawodowy">Zawodowy</option>
      </select>
      <ul style={styles.list}>
        {mentors.map(m=>(<li key={m._id} style={styles.listItem}><button onClick={()=>window.location.hash=`#/chat/${m._id}`}>{m.name}</button></li>))}
      </ul>
    </div>
  );
}

function StudentRooms() {
  const subjects = ['Matematyka','Fizyka','Chemia'];
  return (
    <div>
      <h3>Czatroomy</h3>
      {subjects.map(subj=>(
        <div key={subj}>
          <h4>{subj}</h4>
          <div>-- lista pokoi --</div>
        </div>
      ))}
    </div>
  );
}

// Nauczyciele: lista i nowy chatroom
function TeacherSection() {
  const auth = useAuth();
  const [expanded, setExpanded] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const categories = { podstawowe:['Matematyka','Fizyka'], rozszerzone:['Chemia','Biologia'] };
  useEffect(()=>{
    fetchJson(`${API}/teachers`,{headers:{Authorization:`Bearer ${auth.token}`}}).then(setTeachers);
  },[auth.token]);
  return (
    <div>
      <h3>Nauczyciele</h3>
      {Object.entries(categories).map(([cat,subs])=>(
        <div key={cat}>
          <h4 onClick={()=>setExpanded(expanded===cat?null:cat)} style={styles.expand}>{cat}</h4>
          {expanded===cat && subs.map(sub=>{
            const list=teachers.filter(t=>t.subjectsExtended.includes(sub));
            return <div key={sub}><strong>{sub}</strong><ul>{list.map(t=><li key={t._id}><button onClick={()=>window.location.hash=`#/chat/${t._id}`}>{t.name}</button></li>)}</ul></div>;
          })}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container:{padding:20,fontFamily:'Arial',background:'#1e1e2f',color:'#fff'},
  logout:{background:'#f55',color:'#fff',border:'none',padding:5,borderRadius:4},
  tabBar:{display:'flex',gap:10,marginBottom:20},
  tab:{flex:1,padding:10,background:'#333',color:'#fff',border:'none',cursor:'pointer'},
  tabActive:{flex:1,padding:10,background:'#0f8',color:'#000',border:'none',cursor:'pointer'},
  subTabBar:{display:'flex',gap:10,margin:'10px 0'},
  subTab:{padding:5,background:'#444',color:'#fff',border:'none',cursor:'pointer'},
  subTabActive:{padding:5,background:'#0bf',color:'#000',border:'none',cursor:'pointer'},
  select:{margin:5,padding:5},list:{listStyle:'none',padding:0},listItem:{margin:5},expand:{cursor:'pointer',userSelect:'none'}
};

// Na dole Twojego pliku App.js dodaj (albo w osobnych plikach i importuj):

function Login() {
  const auth = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(null);

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

function Register() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Błąd rejestracji');
      }
      setSuccess(true);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={authStyles.container}>
      <h2 style={authStyles.title}>Rejestracja</h2>
      {error && <p style={authStyles.error}>{error}</p>}
      {success && <p style={authStyles.success}>Rejestracja zakończona sukcesem! Możesz się teraz zalogować.</p>}
      <form onSubmit={handleSubmit} style={authStyles.form}>
        <label style={authStyles.label}>Imię:</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          style={authStyles.input}
          placeholder="Twoje imię"
        />

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

        <button type="submit" style={authStyles.button}>Zarejestruj się</button>
      </form>
      <p style={authStyles.switchText}>
        Masz już konto? <a href="/login" style={authStyles.link}>Zaloguj się</a>
      </p>
    </div>
  );
}

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
  title: {
    marginBottom: 20,
    fontWeight: '700',
    fontSize: 28,
    color: '#61dafb',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  label: {
    textAlign: 'left',
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    padding: '10px 15px',
    fontSize: 16,
    borderRadius: 6,
    border: '1.5px solid #444',
    backgroundColor: '#1f242c',
    color: '#eee',
    outline: 'none',
    transition: 'border-color 0.3s',
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
    transition: 'background-color 0.3s',
  },
  error: {
    color: '#ff6b6b',
    fontWeight: '600',
    marginBottom: 10,
  },
  success: {
    color: '#6bcf6b',
    fontWeight: '600',
    marginBottom: 10,
  },
  switchText: {
    marginTop: 20,
    fontSize: 14,
    color: '#bbb',
  },
  link: {
    color: '#61dafb',
    textDecoration: 'none',
    fontWeight: '600',
  },
};



export default App;
