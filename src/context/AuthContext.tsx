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
  // Ubah User menjadi profile lengkap
  profile: UserProfileResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // Fungsi helper untuk cek akses menu
  canAccess: (menuName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ----------------------------------------------------
// 1. Auth Provider Component
// ----------------------------------------------------

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

  // --- Fungsi Load Profile ---
  const loadProfile = async (storedToken: string) => {
    try {
      const userProfile = await getProfile();
      setProfile(userProfile);
      setAuthToken(storedToken);
    } catch (error) {
      // Token expired atau invalid, API /profile gagal
      console.error("Gagal memuat profil:", error);
      logoutUser(); // Hapus token
      setProfile(null);
      // Redireksi akan ditangani oleh useEffect atau Middleware
    } finally {
      setIsLoading(false);
    }
  };

  // 1. useEffect untuk Initial Load dan Route Protection
  useEffect(() => {
    const storedToken = getToken();

    if (storedToken) {
      loadProfile(storedToken); // Muat profil jika token ada
    } else {
      // Jika tidak ada token
      const isProtectedRoute = !publicRoutes.includes(pathname);
      if (isProtectedRoute) {
        router.replace('/signin');
      }
      setIsLoading(false);
    }
  }, [pathname]); // Bergantung pada pathname dan harus dipicu hanya sekali di mount

  // 2. Update fungsi Login
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { access_token } = await loginUser(email, password); // loginUser akan set token di cookie

      // Langkah KRUSIAL: Ambil data profile segera setelah token di set
      await loadProfile(access_token);

      router.push('/'); // Redirect ke Root setelah profile dimuat
    } catch (error) {
      // Error akan ditangani oleh toast di authService
      setAuthToken(null);
      setProfile(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Fungsi Helper RBAC
  const canAccess = (menuName: string): boolean => {
    if (!profile) return false;
    // Cek apakah ada item di array access yang mena-match menuName
    return profile.role.access.some(a => a.menu === menuName && a.is_read);
  };

  const value = {
    profile, // Menggunakan profile sebagai data user
    token,
    isAuthenticated: !!profile, // User dianggap authenticated jika profile ada
    isLoading,
    login,
    logout: () => {
      logoutUser();
      setAuthToken(null);
      setProfile(null);
      router.push('/signin');
    },
    canAccess, // Tambahkan helper RBAC
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ----------------------------------------------------
// 2. Custom Hook untuk Akses Context
// ----------------------------------------------------

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};