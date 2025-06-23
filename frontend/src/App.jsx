// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RequireAuth from './components/RequireAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudentPanel from './pages/StudentPanel';
import ChatRoom from './pages/ChatRoom';
import NotFound from './pages/NotFound';

function Home() {
  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h1>Witaj w PeerX!</h1>
      <nav>
        <a href="/login" style={{ marginRight: 10 }}>Logowanie</a>
        <a href="/register" style={{ marginRight: 10 }}>Rejestracja</a>
        <a href="/student-panel">Panel ucznia</a>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/student-panel"
          element={
            <RequireAuth>
              <StudentPanel />
            </RequireAuth>
          }
        />
        <Route
          path="/chatroom/:roomId"
          element={
            <RequireAuth>
              <ChatRoom />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
