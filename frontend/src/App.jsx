import React, { useState, useContext, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useParams } from 'react-router-dom';

const SUBJECTS = [
  "Język polski", "Język angielski", "Język niemiecki", "Język francuski", "Język rosyjski",
  "Matematyka", "Biologia", "Chemia", "Fizyka", "Geografia",
  "Historia", "Wiedza o społeczeństwie", "Historia sztuki", "Historia muzyki",
  "Filozofia", "Informatyka", "Język łaciński i kultura antyczna",
  "Edukacja obywatelska", "Język hiszpański"
];

const API_URL = "http://localhost:3000";

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('peerx-user')));

  const login = (username, password) => {
    const storedUsers = JSON.parse(localStorage.getItem('peerx-users')) || [];
    const existingUser = storedUsers.find(u => u.name === username && u.password === password);
    if (existingUser) {
      localStorage.setItem('peerx-user', JSON.stringify(existingUser));
      setUser(existingUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('peerx-user');
    setUser(null);
  };

  const register = (newUser) => {
    const storedUsers = JSON.parse(localStorage.getItem('peerx-users')) || [];
    if (storedUsers.find(u => u.name === newUser.name)) return false; // Unikalność użytkownika
    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem('peerx-users', JSON.stringify(updatedUsers));
    localStorage.setItem('peerx-user', JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

const NavBar = () => {
  const { user, logout } = useAuth();
  return (
    <nav className="p-4 bg-blue-700 text-white flex justify-between">
      <div>
        <Link to="/" className="mr-4 font-bold">PeerX</Link>
        {user && (
          <>
            <Link to="/dashboard" className="mr-2">Dashboard</Link>
            <Link to="/groups" className="mr-2">Groups</Link>
          </>
        )}
      </div>
      <div>
        {user ? (
          <>
            <span className="mr-2">Witaj, {user.name}</span>
            <button onClick={logout} className="underline">Wyloguj</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-2">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const ChatRoom = ({ subject }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_URL}/chat/${encodeURIComponent(subject)}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Chat fetch error:", err);
        setError("Nie udało się załadować wiadomości. Sprawdź połączenie z serwerem.");
      }
    };
    fetchMessages();
  }, [subject]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const message = { author: user.name, text: input.trim(), subject };

    try {
      const res = await fetch(`${API_URL}/chat/${encodeURIComponent(subject)}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });

      const contentType = res.headers.get("Content-Type") || "";
      if (!res.ok || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("Unexpected response:", text);
        throw new Error("Nieprawidłowa odpowiedź serwera.");
      }

      const newMsg = await res.json();
      setMessages(prev => [...prev, newMsg]);
      setInput("");
    } catch (err) {
      console.error("Chat send error:", err);
      alert("Błąd przy wysyłaniu wiadomości. Sprawdź połączenie z serwerem.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Czat: {subject}</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <div className="max-h-80 overflow-y-scroll border p-4 bg-white mb-4">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <strong>{msg.author}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border p-2 w-full"
        placeholder="Napisz wiadomość..."
      />
      <button onClick={sendMessage} className="mt-2 bg-blue-500 text-white px-4 py-2">Wyślij</button>
    </div>
  );
};

const GroupPage = () => {
  const { subject } = useParams();
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <ChatRoom subject={decodeURIComponent(subject)} />;
};

const GroupsList = () => (
  <div className="p-8">
    <h1 className="text-2xl mb-4">Wybierz przedmiot</h1>
    <ul className="list-disc pl-6">
      {SUBJECTS.map(sub => (
        <li key={sub}>
          <Link to={`/groups/${encodeURIComponent(sub)}`} className="text-blue-700 underline">
            {sub}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-2xl">Witaj, {user.name}!</h1>
      <p className="mt-2">
        Przejdź do <Link to="/groups" className="text-blue-600 underline">listy grup</Link>.
      </p>
    </div>
  );
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!name || !password) return setError("Wypełnij wszystkie pola.");
    if (login(name, password)) {
      navigate("/dashboard");
    } else {
      setError("Nieprawidłowe dane logowania.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl mb-4">Logowanie</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleLogin}>
        <input className="block border p-2 mb-2 w-full" placeholder="Nazwa użytkownika" value={name} onChange={e => setName(e.target.value)} />
        <input className="block border p-2 mb-2 w-full" type="password" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Zaloguj się</button>
      </form>
    </div>
  );
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !password) return setError("Wypełnij wszystkie pola.");
    const newUser = { name, password };
    const success = register(newUser);
    if (!success) {
      setError("Użytkownik o takiej nazwie już istnieje.");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="p-8">
      <h1 className="text-xl mb-4">Rejestracja</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleRegister}>
        <input className="block border p-2 mb-2 w-full" placeholder="Nazwa użytkownika" value={name} onChange={e => setName(e.target.value)} />
        <input className="block border p-2 mb-2 w-full" type="password" placeholder="Hasło" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="bg-green-500 text-white px-4 py-2">Zarejestruj się</button>
      </form>
    </div>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/groups" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups" element={<GroupsList />} />
        <Route path="/groups/:subject" element={<GroupPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
