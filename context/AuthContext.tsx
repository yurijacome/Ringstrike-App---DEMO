"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_AUTH_USER, MOCK_TOKEN } from '@/services/mockData';

interface User {
  id: number;
  email: string;
  nome: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: (redirect?: boolean) => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(MOCK_AUTH_USER);
  const [token, setToken] = useState<string | null>(MOCK_TOKEN);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    // Portfolio mock: mantém um usuário demonstrativo sempre logado.
    setUser(MOCK_AUTH_USER);
    setToken(MOCK_TOKEN);
    setLoading(false);
  };

  const login = (token: string, user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
    setToken(token);
    setUser(user);
  };

  const logout = (redirect: boolean = true) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userActiveComponent'); // Limpa componente salvo
    }
    setToken(MOCK_TOKEN);
    setUser(MOCK_AUTH_USER);
    if (redirect && typeof window !== 'undefined') {
      router.push('/pageLogin');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
