'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  loginUser,
  logoutUser,
  getToken,
  setToken,
  getProfile
} from '@/services/authService';
import { usePathname, useRouter } from 'next/navigation';
import { UserProfileResponse } from '@/types/auth/authModel';

interface AuthContextType {
  profile: UserProfileResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  canAccess: (menuName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null); // State untuk Profile
  const [token, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const publicRoutes = ['/signin', '/auth/signup', '/auth/reset-password'];

  const loadProfile = async (storedToken: string) => {
    try {
      const userProfile = await getProfile();
      setProfile(userProfile);
      setAuthToken(storedToken);
    } catch (error) {
      console.error("Gagal memuat profil:", error);
      logoutUser();
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = getToken();

    if (storedToken) {
      loadProfile(storedToken);
    } else {
      const isProtectedRoute = !publicRoutes.includes(pathname);
      if (isProtectedRoute) {
        router.replace('/signin');
      }
      setIsLoading(false);
    }
  }, [pathname]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { access_token } = await loginUser({
        email,
        password,
        platform: 'web'
      });

      await loadProfile(access_token);

      router.push('/');
    } catch (error) {
      setAuthToken(null);
      setProfile(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const canAccess = (menuName: string): boolean => {
    if (!profile) return false;
    return profile.role.access.some(a => a.menu === menuName && a.is_read);
  };

  const value = {
    profile,
    token,
    isAuthenticated: !!profile,
    isLoading,
    login,
    logout: () => {
      logoutUser();
      setAuthToken(null);
      setProfile(null);
      router.push('/signin');
    },
    canAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};