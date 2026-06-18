import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, allowedRole }) {
  const { auth } = useAuth();
  if (!auth) return <Navigate to="/login" />;
  if (allowedRole && auth.role !== allowedRole) return <Navigate to="/" />;
  return children;
}
