import React, { createContext, useCallback, useEffect, useState } from 'react';
import { getUserProfile } from '../services/userService';
import { getToken, setToken, removeToken, isTokenExpired } from '../utils/auth';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const login = useCallback(async (authData) => {
    // authData can be a token string or an object { token, user }
    const token = authData?.token || authData;
    if (!token) return null;

    setToken(token);
    setIsAuthenticated(true);

    try {
      const profile = authData?.user ? authData.user : await getUserProfile();
      setUser(profile);
      return profile;
    } catch (err) {
      console.error('Failed to fetch profile after login', err);
      logout();
      return null;
    }
  }, [logout]);

  // On mount, try to restore session from token
  useEffect(() => {
    const restore = async () => {
      const token = getToken();
      if (token && !isTokenExpired(token)) {
        setIsAuthenticated(true);
        try {
          const profile = await getUserProfile();
          setUser(profile);
        } catch (err) {
          console.error('Error fetching profile data:', err);
          logout();
        }
      } else {
        logout();
      }
      setLoading(false);
    };
    restore();
  }, [logout]);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
