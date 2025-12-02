import { getToken } from '@/services/authService';
import { ApiError } from '../utils/apiError';
import { ResponseCode } from '@/types/shared/responseCode';
import { PaginatedResponse } from '@/types/shared/commonModel';

import { useGlobalModal } from '@/context/ModalContext';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const SUCCESS_CODE = ResponseCode.SUCCESS;

interface RawApiResponse<T> {
  response_code: string;
  response_message: string;
  data?: T;
  page_info?: any;
}

interface ApiFetchProps {
  showError?: boolean;
  showSuccess?: boolean;
  showLoading?: boolean;
  endpoint: string;
  options?: RequestInit;
}

let globalShowPopup: ((title: string, content: string, type: 'error' | 'warning' | 'info' | 'success') => void) | null = null;

export function setGlobalErrorHandler(
  handler: (title: string, content: string, type: 'error' | 'warning' | 'info' | 'success') => void
) {
  globalShowPopup = handler;
}

async function executeFetch<T>(props: ApiFetchProps): Promise<RawApiResponse<T>> {
  const token = getToken();

  // 1. Persiapan Header
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...props.options?.headers,
  };

  // 2. Eksekusi Fetch
  const response = await fetch(`${API_BASE_URL}${props.endpoint}`, {
    ...props.options,
    headers,
  });

  let responseJson: RawApiResponse<T>;

  // 3. Parsing JSON & Handle Error Parsing
  try {
    responseJson = await response.json();
  } catch (e) {
    const error = new ApiError(
      'Failed to parse API response as JSON',
      ResponseCode.CLIENT_PARSE_ERROR,
      response.status,
      { parsing_error: e }
    );
    console.error('Failed to parse API response as JSON:', e);
    handleError(error);
    throw error;
  }

  // 4. Pengelompokan Logika Error (HTTP Status & API Response Code)
  // Periksa status HTTP (4xx/5xx) atau response code API yang tidak sukses
  if (!response.ok || responseJson.response_code !== SUCCESS_CODE) {

    // Tentukan pesan error mana yang akan digunakan
    const message = responseJson.response_message ||
      (response.ok ? 'Unknown API Error' : `HTTP Error: ${response.status}`);

    // Tentukan response code mana yang akan digunakan
    const code = responseJson.response_code || 'HTTP_ERROR';

    const error = new ApiError(
      message,
      code,
      response.status,
      responseJson
    );

    handleError(error);
    throw error;
  }

  if (props.showSuccess) {
    toast.success(responseJson.response_message);
    // globalShowPopup(responseJson.response_message, '', 'success',);

  }

  return responseJson;
}

export async function apiFetch<T>(props: ApiFetchProps): Promise<T> {
  const responseJson = await executeFetch<T>(props);

  if (responseJson.data === undefined) {
    throw new ApiError('Data payload is missing in API response.', '97', 200);
  }

  return responseJson.data;
}

export async function apiFetchPaginated<T>(props: ApiFetchProps): Promise<PaginatedResponse<T>> {
  const responseJson = await executeFetch<T[]>(props);

  if (!responseJson.data || !responseJson.page_info) {
    throw new ApiError('Missing data or page_info in paginated response.', '96', 200);
  }

  return {
    data: responseJson.data as T[],
    page_info: responseJson.page_info,
  };
}

function handleError(error: ApiError) {
  console.error('API Error:', error);

  if (globalShowPopup) {
    const title = `Oops, Terjadi Kesalahan!`;
    const content = error.message;
    globalShowPopup(title, content, 'error',);
  }
}