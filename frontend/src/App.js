// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authcontext';
import RequireAuth from './components/RequireAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChatRoom from './pages/ChatRoom';
<Route path="/chat/:roomId" element={<RequireAuth><ChatRoom /></RequireAuth>} />


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

export default App;