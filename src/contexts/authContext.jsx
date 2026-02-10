import React, { createContext, useCallback, useEffect, useState } from 'react';
import { getUserProfile } from '../services/userService';
import { getToken, setToken, removeToken, isAuthenticated as checkAuthStatus } from '../utils/auth';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para logout
  const handleLogout = useCallback(() => {
    removeToken();
    setUser(null);
  }, [])

  // Función legacy para mantener compatibilidad (pero ahora espera token)
  const handleSetUser = useCallback((authData) => {
    if (authData.token) {
      setToken(authData.token);
    }
  }, [])

  // Verificar si hay token al cargar la aplicación
  useEffect(() => {
    const token = getToken();

    if (token && checkAuthStatus()) {
      getUserProfile()
        .then((profileData) => {
          setUser(profileData);
        })
        .catch((error) => {
          console.error('Error fetching profile data:', error);
          removeToken();
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log('hola no hay token o está expirado')
      setLoading(false);
      removeToken();
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      handleSetUser,
      handleLogout,
      isAuthenticated: checkAuthStatus(),
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
