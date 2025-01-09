import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/UserAuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Optional: Ladeindikator anzeigen
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Wenn nicht authentifiziert, leite den Benutzer zur Login-Seite um
    return <Navigate to='/' replace />;
  }

  // Wenn authentifiziert, rendere die gewünschte Route
  return children;
};

export default ProtectedRoute;
