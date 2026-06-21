'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { User, AuthContextType, ApiResponse } from '@/types';
import { AxiosError } from 'axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // On mount, verify current session
  const fetchMe = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get<ApiResponse<User>>('/auth/me');
      if (data.success && data.data) {
        setUser(data.data);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      const { data } = await axiosInstance.post<ApiResponse<User>>('/auth/login', {
        email,
        password,
      });
      if (data.success && data.data) {
        setUser(data.data);
        router.push('/dashboard');
      }
    },
    [router]
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<void> => {
      const { data } = await axiosInstance.post<ApiResponse<User>>('/auth/register', {
        name,
        email,
        password,
      });
      if (data.success && data.data) {
        setUser(data.data);
        router.push('/dashboard');
      }
    },
    [router]
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch {
      // Silently fail logout errors
    } finally {
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper to extract error messages from Axios errors
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return (
      (error.response?.data as ApiResponse)?.message ??
      error.message ??
      'Something went wrong'
    );
  }
  return 'Something went wrong';
};
