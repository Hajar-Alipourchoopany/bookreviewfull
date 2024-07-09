import React, { useContext, createContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token && !userData) {
      // Versuchen Sie, Benutzerinformationen mit dem Token zu laden
      (async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(response.data);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Fehler beim Abrufen der Benutzerdaten:', error);
          // Wenn das Token ungültig ist, löschen Sie es
          Cookies.remove('token');
        }
      })();
    }
  }, [userData]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/login',
        { email, password },
        { withCredentials: true }
      );
      setUserData(response.data);
      setIsLoggedIn(true);
      // Setzen Sie das Token in Cookies
      Cookies.set('token', response.data.token, { expires: 7 });
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:8000/api/logout',
        {},
        { withCredentials: true }
      );
      setUserData(null);
      setIsLoggedIn(false);
      // Entfernen Sie das Token aus den Cookies
      Cookies.remove('token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/api/register',
        { username, email, password },
        { withCredentials: true }
      );
      setUserData(response.data);
      setIsLoggedIn(true);
      // Setzen Sie das Token in Cookies
      Cookies.set('token', response.data.token, { expires: 7 });
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Registration failed');
    }
  };

  const values = {
    userData,
    isLoggedIn,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export default AuthContext;
