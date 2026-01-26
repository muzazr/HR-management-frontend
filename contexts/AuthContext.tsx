'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/auth';
import { AuthHelper } from '../lib/auth';
import { ApiService } from '../lib/api';

interface AuthContextType {
  user:  User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const initAuth = async () => {
      const token = AuthHelper.getToken();
      const savedUser = AuthHelper.getUser();

      if (token && savedUser) {
        setUser(savedUser);
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (token: string, userData: User) => {
    AuthHelper.saveAuth(token, userData);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      AuthHelper.clearAuth();
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await ApiService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        AuthHelper.saveAuth(AuthHelper.getToken()!, response.data);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}