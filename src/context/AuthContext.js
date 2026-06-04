import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.post('/api/login', { email, password });
      if (response.data && response.data.token) {
        const newToken = response.data.token;
        setToken(newToken);
        localStorage.setItem('token', newToken);
        navigate('/dashboard');
        return true;
      }
      throw new Error('Token tidak ditemukan');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email dan password Anda.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
