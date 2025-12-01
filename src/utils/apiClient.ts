// src/utils/apiClient.ts

import { getToken } from '@/services/authService';
import { ApiError } from '../utils/apiError'; // Import error kustom
import { ResponseCode } from '@/types/shared/responseCode';
import { PaginatedResponse } from '@/types/shared/commonModel';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SUCCESS_CODE = ResponseCode.SUCCESS;

interface RawApiResponse<T> {
  response_code: string;
  response_message: string;
  data?: T; // Data bisa berupa array T[] atau object T
  page_info?: any; // Tambahkan page_info (bisa berupa any atau PageInfo)
}

// --- Definisi Tipe Response API Global ---
async function executeFetch<T>(endpoint: string, options?: RequestInit): Promise<RawApiResponse<T>> {
  // [CODE DARI LANGKAH SEBELUMNYA, TERMASUK Pengecekan Token dan HTTP Error]

  // 1. Persiapan Header
  const token = getToken();
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

  // 3. Cek Status HTTP
  if (!response.ok) {
    throw new ApiError(
      `HTTP Error: ${response.statusText}`,
      ResponseCode.CLIENT_HTTP_ERROR,
      response.status,
      { url: endpoint }
    );
  }

  // 4. Proses JSON Response
  let responseJson: RawApiResponse<T>;
  try {
    responseJson = await response.json();
  } catch (e) {
    throw new ApiError(
      'Failed to parse API response as JSON',
      ResponseCode.CLIENT_PARSE_ERROR,
      response.status,
      { parsing_error: e }
    );
  }

  // 5. Cek Response Code Internal
  if (responseJson.response_code !== SUCCESS_CODE) {
    throw new ApiError(
      responseJson.response_message || 'Unknown API Error',
      responseJson.response_code,
      response.status,
      responseJson
    );
  }

  return responseJson;
}

// ---------------------------------------------------------------------
// FUNGSI API FETCH UNTUK RESPONSE TANPA PAGINATION (Mengembalikan hanya data payload)
// ---------------------------------------------------------------------

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const responseJson = await executeFetch<T>(endpoint, options);

  // Pastikan data ada sebelum dikembalikan
  if (responseJson.data === undefined) {
    throw new ApiError('Data payload is missing in API response.', '97', 200);
  }

  return responseJson.data;
}


// ---------------------------------------------------------------------
// FUNGSI API FETCH UNTUK RESPONSE DENGAN PAGINATION (Mengembalikan data dan page_info)
// ---------------------------------------------------------------------

/**
 * Handler API untuk endpoint yang mengembalikan data list dan page_info.
 * Mengembalikan objek yang berisi data array dan page_info.
 * @param T Tipe data dari setiap item dalam array (misal: Merchant)
 */
export async function apiFetchPaginated<T>(endpoint: string, options?: RequestInit): Promise<PaginatedResponse<T>> {
  const responseJson = await executeFetch<T[]>(endpoint, options);

  // Memastikan kedua properti yang dibutuhkan ada
  if (!responseJson.data || !responseJson.page_info) {
    throw new ApiError('Missing data or page_info in paginated response.', '96', 200);
  }

  // Mengembalikan objek yang sudah dibersihkan
  return {
    data: responseJson.data as T[],
    page_info: responseJson.page_info,
  };
}