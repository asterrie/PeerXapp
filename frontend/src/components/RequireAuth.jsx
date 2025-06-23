import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <p>Sprawdzanie autoryzacji...</p>;
  return token ? children : <Navigate to="/login" />;
}
