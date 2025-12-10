import { getToken } from '@/services/authService';
import { ApiError } from '../utils/apiError';
import { ResponseCode } from '@/types/shared/responseCode';
import { PaginatedResponse } from '@/types/shared/commonModel';

import toast from 'react-hot-toast';

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
  // Menggunakan Omit untuk memastikan body untuk POST/PUT/DELETE dikontrol secara eksplisit (sebagai objek)
  options?: Omit<RequestInit, 'body'> & { body?: Record<string, any> };
  params?: Record<string, any>; // Objek untuk query parameters
  endpointRoleType: 'default' | 'base' | 'admin' | 'client';
}

let globalShowPopup: ((
  title: string,
  content: string,
  type: 'error' | 'warning' | 'info' | 'success',
  autoClose: boolean
) => void) | null = null;

export function setGlobalModalHandler(
  handler: (
    title: string,
    content: string,
    type: 'error' | 'warning' | 'info' | 'success',
    autoClose: boolean
  ) => void
) {
  globalShowPopup = handler;
}

async function executeFetch<T>(props: ApiFetchProps): Promise<RawApiResponse<T>> {
  const token = getToken();
  const method = props.options?.method?.toUpperCase() || 'GET';

  // FIX: Destructure 'body' (rawBody) dari props.options agar tidak terjadi error tipe saat menyebar ke RequestInit
  const { body: rawBody, ...restOptions } = props.options || {};

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    // Ambil headers dari sisa options (restOptions)
    ...restOptions.headers,
  };

  let finalUrl = buildAPIUrl(props.endpointRoleType, props.endpoint);

  // Inisialisasi finalOptions dengan restOptions (yang sudah kompatibel dengan RequestInit)
  let finalOptions: RequestInit = {
    ...restOptions,
    method,
    headers,
  };

  // --- 1. HANDLE QUERY PARAMS (UNTUK GET) ---
  if (method === 'GET' && props.params) {
    const query = new URLSearchParams(props.params as any).toString();
    finalUrl = `${finalUrl}?${query}`;

    // Pastikan body dihapus untuk GET
    if (finalOptions.body) {
      delete finalOptions.body;
    }
  }
  // --- 2. HANDLE JSON BODY (UNTUK POST, PUT, DELETE) ---
  else if (method !== 'GET' && rawBody) { // Gunakan rawBody yang sudah diekstrak
    // Diasumsikan rawBody adalah objek mentah (raw object)
    try {
      finalOptions.body = JSON.stringify(rawBody);
    } catch (e) {
      console.error("Failed to stringify request body:", e);
      // Tangani kesalahan stringify secara eksplisit
      throw new ApiError('Failed to serialize request body to JSON.', ResponseCode.CLIENT_PARSE_ERROR, 0);
    }
  }

  const response = await fetch(finalUrl, finalOptions);

  console.log("props:", props);
  console.log("response:", response);

  let responseJson: RawApiResponse<T>;

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

  if (!response.ok || responseJson.response_code !== SUCCESS_CODE) {

    const message = responseJson.response_message ||
      (response.ok ? 'Unknown API Error' : `HTTP Error: ${response.status}`);

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
    if (globalShowPopup) {
      globalShowPopup(
        responseJson.response_message,
        responseJson.response_message,
        'success',
        true
      );
    } else {
      toast.success(responseJson.response_message);
    }
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

function buildAPIUrl(type: 'default' | 'base' | 'admin' | 'client', endpoint: string): string {
  let apiUrl = process.env.NEXT_PUBLIC_API_URL;
  switch (type) {
    case 'default':
      apiUrl = process.env.NEXT_PUBLIC_API_URL;
      break;
    case 'base':
      apiUrl = `${apiUrl}${process.env.NEXT_PUBLIC_ENDPOINT_URL}`;
      break;
    case 'admin':
      apiUrl = `${apiUrl}${process.env.NEXT_PUBLIC_ENDPOINT_ADMIN_URL}`;
      break;
    case 'client':
      apiUrl = `${apiUrl}${process.env.NEXT_PUBLIC_ENDPOINT_CLIENT_URL}`;
      break;
    default:
      apiUrl = '';
      break;
  }
  return `${apiUrl}${endpoint}`;
}

function handleError(error: ApiError) {
  console.error('API Error:', error);

  if (globalShowPopup) {
    const title = `Oops, Terjadi Kesalahan!`;
    const content = error.message;
    globalShowPopup(title, content, 'error', false);
  }
}