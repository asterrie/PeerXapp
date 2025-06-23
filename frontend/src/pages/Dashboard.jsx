import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Witaj, {user.username}!</h1>
      <p>Twoja rola: {user.role}</p>
      {user.role === 'student' ? (
        <button onClick={() => navigate('/student')}>Przejdź do Panelu Ucznia</button>
      ) : (
        <button onClick={() => navigate('/teacher')}>Przejdź do Panelu Nauczyciela</button>
      )}
    </div>
  );
}
