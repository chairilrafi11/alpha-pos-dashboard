import { LoginResponse, UserProfileResponse } from '@/types/auth/authModel';
import { SignInRequest } from '@/types/auth/signInRequest';
import { apiFetch } from '@/utils/apiClient';
import Cookies from 'js-cookie';

const AUTH_TOKEN_KEY = 'cms_pos_auth_token';

export const getToken = (): string | null => {
  return Cookies.get(AUTH_TOKEN_KEY) || null;
};

export const setToken = (token: string): void => {
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

export async function loginUser(body: SignInRequest): Promise<LoginResponse> {
  try {
    const data = await apiFetch<LoginResponse>({
      endpoint: '/sign-in',
      endpointRoleType: 'base',
      options: {
        method: 'POST',
        body: body,
      },
    });

    setToken(data.access_token);

    return data;
  } catch (error) {
    throw error;
  }
}

export function logoutUser(): void {
  removeToken();
}

export async function getProfile(): Promise<UserProfileResponse> {
  const profile = await apiFetch<UserProfileResponse>({
    endpoint: '/profile',
    endpointRoleType: 'base',
    options: {
      method: 'GET',
    },
  });

  return profile;
}