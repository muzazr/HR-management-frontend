import { Storage } from '../storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-recruitment-app-sigma.vercel.app';
export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

// Debug log environment (disabled by default)
// console.log('Environment Config:', {
//   API_BASE_URL,
//   USE_MOCK_API,
//   NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
//   NEXT_PUBLIC_USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK,
// });

// helpers
export async function delay(ms: number = 800): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== BASE FETCH ====================

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

/**
 * apiClient
 * - Wrapper fetch standar yang menambahkan Authorization header (dari Storage) kecuali skipAuth=true.
 * - Menangani parsing JSON, validasi content-type, dan penanganan error umum (401 -> clear session + redirect).
 * - Melempar Error dengan pesan yang sudah diformat bila response tidak ok.
 */
export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;

  // Setup headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Add auth token if not skipped
  if (!skipAuth) {
    const token = Storage.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response as any;
    }

    // Parse JSON response
    const data = await response.json();

    // Handle errors
    if (!response.ok) {
      // Handle 401 - Session expired
      if (response.status === 401) {
        Storage.clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Session expired. Please login again.');
      }

      // Other errors
      const errorMessage = data.detail || data.message || data.error || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    console.error('API Error:', endpoint, error.message);
    throw error;
  }
}

/**
 * uploadClient
 * - Khusus untuk upload file via FormData.
 * - Menambahkan Authorization header jika token tersedia.
 * - Menggunakan pola penanganan error serupa apiClient (termasuk 401 handling).
 */
export async function uploadClient<T>(
  endpoint: string,
  formData: FormData,
  method: 'POST' | 'PUT' | 'PATCH' = 'POST'
): Promise<T> {
  const token = Storage.getToken();

  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: formData,
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response as any;
    }

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        Storage.clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Session expired. Please login again.');
      }

      const errorMessage = data.detail || data.message || data.error || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    // Silangkan logging di sini sesuai kebutuhan (tidak otomatis console.error untuk production).
    // console.error('Upload Error:', endpoint, error.message);
    throw error;
  }
}