// src/utils/apiClient.ts

import { getToken } from '@/services/authService';
import { ApiError } from '../utils/apiError'; // Import error kustom
import { ResponseCode } from '@/types/shared/responseCode';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SUCCESS_CODE = ResponseCode.SUCCESS;

// --- Definisi Tipe Response API Global ---
interface ApiResponse<T> {
  response_code: string;
  response_message: string;
  data: T; // Tipe data payload yang diharapkan
}

/**
 * Handler API Global yang menangani Autorisasi, Response HTTP, dan Response Code Internal.
 * @param endpoint Endpoint API (misalnya '/auth/login')
 * @param options Opsi fetch standar
 * @returns Promise yang me-resolve data payload yang bersih
 */
export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getToken();

  // 1. Persiapan Header
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  // 2. Panggilan Fetch
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 3. Cek Status HTTP (misalnya 4xx atau 5xx)
  if (!response.ok) {
    toast.error(response.statusText);
    throw new ApiError(
      `HTTP Error: ${response.statusText}`,
      ResponseCode.CLIENT_HTTP_ERROR, // Digunakan Enum
      response.status,
      { url: endpoint }
    );
  }

  // 4. Proses JSON Response
  let responseJson: ApiResponse<T>;
  try {
    responseJson = await response.json();
  } catch (e) {
    // Jika gagal parsing JSON (misalnya API mengembalikan non-JSON)
    throw new ApiError(
      'Failed to parse API response as JSON',
      '98',
      response.status,
      { parsing_error: e }
    );
  }

  // 5. Cek Response Code Internal ('00' untuk Sukses)
  if (responseJson.response_code !== SUCCESS_CODE) {

    // Pengecekan spesifik untuk Unauthorized/Forbidden
    if (responseJson.response_code === ResponseCode.UNAUTHORIZED) {
      // Logic logout/redirect jika token expired/invalid, dll.
    }
    
    toast.error(responseJson.response_message);

    throw new ApiError(
      responseJson.response_message || 'Unknown API Error',
      responseJson.response_code,
      response.status,
      responseJson
    );

  }

  return responseJson.data;
}