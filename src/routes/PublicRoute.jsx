import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/context/AuthContext';

function PublicRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PublicRoute;