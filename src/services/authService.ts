import { LoginResponse, UserProfileResponse } from '@/types/auth/authModel';
import { apiFetch } from '@/utils/apiClient';
import Cookies from 'js-cookie'; // Import library Cookies


// --- KEYS ---
// Nama kunci cookie harus sama persis dengan yang Anda gunakan di middleware.ts
const AUTH_TOKEN_KEY = 'cms_pos_auth_token';

// ----------------------------------------------------
// 1. Fungsi Interaksi Cookie
// ----------------------------------------------------

export const getToken = (): string | null => {
  return Cookies.get(AUTH_TOKEN_KEY) || null;
};

export const setToken = (token: string): void => {
  // Menyimpan token di Cookie
  // secure: true (hanya lewat HTTPS) - aktifkan di production
  // sameSite: 'strict' (direkomendasikan)
  // expires: Anda bisa atur masa berlaku (misal 7 hari)
  Cookies.set(AUTH_TOKEN_KEY, token, {
    expires: 7,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    path: '/'
  });
};

export const removeToken = (): void => {
  Cookies.remove(AUTH_TOKEN_KEY);
};

// ----------------------------------------------------
// 2. Fungsi Logika Auth API
// ----------------------------------------------------

/**
 * Memanggil API login dan menyimpan token di Cookie jika berhasil.
 */
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    // T adalah LoginData yang diharapkan dari response.data
    const data = await apiFetch<LoginResponse>('/sign-in', {
      method: 'POST',
      body: JSON.stringify({ email, password, platform: 'web' }),
      headers: { 'Content-Type': 'application/json' },
    });

    // data HANYA berisi { access_token, token_type, expired_at } (tanpa response_code)
    setToken(data.access_token);

    return data;

  } catch (error) {

    throw error; // Lempar error untuk ditangani di AuthContext
  }
}

/**
 * Menghapus token dari Cookie.
 */
export function logoutUser(): void {
  removeToken();
}

export async function getProfile(): Promise<UserProfileResponse> {
  // apiFetch akan otomatis menyertakan token Bearer dari cookie
  // dan menangani error jika token expired/invalid
  const profile = await apiFetch<UserProfileResponse>('/profile', {
    method: 'GET',
  });

  return profile;
}