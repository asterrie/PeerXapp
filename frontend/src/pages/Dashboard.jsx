// frontend/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'student') navigate('/student-panel');
    // if (user?.role === 'teacher') navigate('/teacher-panel'); // opcjonalnie później
  }, [user, navigate]);

  return <p>Witaj, trwa przekierowywanie...</p>;
}
