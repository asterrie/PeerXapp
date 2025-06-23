import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chatroom from './pages/ChatRoom';
import StudentPanel from './pages/StudentPanel';
import TeacherPanel from './pages/TeacherPanel';
import NotFound from './pages/NotFound';

import RequireAuth from './components/RequireAuth';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
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
        path="/chatroom/:roomId"
        element={
          <RequireAuth>
            <Chatroom />
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
        path="/teacher-panel"
        element={
          <RequireAuth>
            <TeacherPanel />
          </RequireAuth>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
