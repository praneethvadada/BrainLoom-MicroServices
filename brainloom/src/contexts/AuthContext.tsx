import React, { createContext, useState, useEffect } from 'react';
import { User } from '../types';
import { login } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loginUser: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loginUser: async () => {},
  logout: () => {},
  isAdmin: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    if (saved && saved !== 'undefined') {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const loginUser = async (email: string, pass: string) => {
    const data = await login(email, pass);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logout, isAdmin: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
