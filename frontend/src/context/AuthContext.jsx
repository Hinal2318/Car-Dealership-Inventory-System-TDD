import { createContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

// Helper function to decode JWT token payload without external libraries
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    // Fallback: decode token if savedUser is not present
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      const decoded = decodeToken(savedToken);
      if (decoded) {
        return {
          id: decoded.userId,
          role: decoded.role,
        };
      }
    }
    return null;
  });

  // Keep authorization header in sync if token state changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token]);

  // Login action
  const login = async (email, password) => {
    const response = await axiosClient.post('/auth/login', { email, password });
    const { token: receivedToken } = response.data;
    
    const decoded = decodeToken(receivedToken);
    const userData = {
      id: decoded?.userId,
      role: decoded?.role,
      email: email.toLowerCase().trim(),
    };

    setToken(receivedToken);
    setUser(userData);
    
    localStorage.setItem('token', receivedToken);
    localStorage.setItem('user', JSON.stringify(userData));

    return response.data;
  };

  // Register action
  const register = async (email, password, role = 'user') => {
    const response = await axiosClient.post('/auth/register', { email, password, role });
    
    // Automatically log the user in after successful registration
    await login(email, password);
    
    return response.data;
  };

  // Logout action
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
