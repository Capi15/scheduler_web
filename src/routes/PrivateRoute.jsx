import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/context/AuthContext';

function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;