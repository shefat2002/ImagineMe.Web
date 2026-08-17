'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/lib/api/auth';
import {
  AuthResponse,
  ChildAuthResponse,
  RegisterRequest,
  LoginRequest,
  ChildLoginRequest,
  UserType,
} from '@/types/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  userType: UserType;
  childData?: {
    childId: string;
    username: string;
    coins: number;
    currentStreak: number;
  };
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  childLogin: (credentials: ChildLoginRequest) => Promise<ChildAuthResponse>;
  register: (data: RegisterRequest) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  isParent: boolean;
  isAdmin: boolean;
  isChild: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Failed to parse user data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Store user data when it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
    } else {
      localStorage.removeItem('userData');
    }
  }, [user]);

  const login = useCallback(async (credentials: LoginRequest): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);

      // Store token
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.token);
      }

      // Set user state
      const newUser: User = {
        id: '', // Will be populated from token or additional API call
        email: credentials.email,
        fullName: '',
        userType: UserType.Parent, // Default, will be updated from token
      };

      setUser(newUser);
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  const childLogin = useCallback(async (credentials: ChildLoginRequest): Promise<ChildAuthResponse> => {
    setLoading(true);
    try {
      const response = await authService.childLogin(credentials);

      // Store token
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.token);
      }

      // Set user state with child data
      const newUser: User = {
        id: response.childId,
        email: '',
        fullName: response.username,
        userType: UserType.Child,
        childData: {
          childId: response.childId,
          username: response.username,
          coins: response.coins,
          currentStreak: response.currentStreak,
        },
      };

      setUser(newUser);
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const response = await authService.register(data);

      // Store token
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.token);
      }

      // Set user state
      const newUser: User = {
        id: '',
        email: data.email,
        fullName: data.fullName,
        userType: data.userType,
      };

      setUser(newUser);
      setLoading(false);
      return response;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    // Clear tokens and user data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
    }

    setUser(null);

    // Redirect to login
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }, []);

  const value: AuthContextType = {
    user,
    setUser,
    loading,
    login,
    childLogin,
    register,
    logout,
    isAuthenticated: !!user,
    isParent: user?.userType === UserType.Parent,
    isAdmin: user?.userType === UserType.Admin,
    isChild: user?.userType === UserType.Child,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};