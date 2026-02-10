// ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../contexts/authContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useContext(AuthContext);
  console.log('entro')
  console.log('isAuthenticated', isAuthenticated, 'user', user, 'loading', loading)

  if (loading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <p>Cargando...</p>
      </div>
    );
  }

  return isAuthenticated && user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
