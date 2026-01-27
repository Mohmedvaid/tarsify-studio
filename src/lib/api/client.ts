import { auth } from '@/lib/firebase/config';
import type { PaginationMeta } from '@/types/api';

// Trim trailing slash to prevent double slashes in API URLs
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/+$/, '');

export class ApiClientError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
  }
}

// Backend response wrapper format
interface BackendResponse<T> {
  success: boolean;
  data?: T;
  meta?: PaginationMeta;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken();
  } catch {
    return null;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build URL with query params
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Get auth token
  const token = await getAuthToken();

  // Build headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  // Make request
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  // Handle non-OK responses
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    let errorCode: string | undefined;

    try {
      const errorData = await response.json() as BackendResponse<unknown>;
      if (errorData.error) {
        errorMessage = errorData.error.message || errorMessage;
        errorCode = errorData.error.code;
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    throw new ApiClientError(errorMessage, response.status, errorCode);
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return undefined as T;
  }

  // Parse JSON response and unwrap backend format
  const json = await response.json() as BackendResponse<T>;
  
  // Backend wraps responses in { success, data, meta }
  // Unwrap and return the data
  if (json.data !== undefined) {
    // For paginated responses, transform meta to pagination
    if (json.meta && Array.isArray(json.data)) {
      return {
        data: json.data,
        pagination: json.meta,
      } as T;
    }
    return json.data;
  }
  
  // Fallback for responses not wrapped
  return json as unknown as T;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),

  // Special method for file uploads
  upload: async <T>(endpoint: string, file: File, fieldName = 'file'): Promise<T> => {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append(fieldName, file);

    const headers: HeadersInit = {};
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Upload failed';
      let errorCode: string | undefined;
      try {
        const errorData = await response.json() as BackendResponse<unknown>;
        if (errorData.error) {
          errorMessage = errorData.error.message || errorMessage;
          errorCode = errorData.error.code;
        }
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new ApiClientError(errorMessage, response.status, errorCode);
    }

    // Unwrap backend response format
    const json = await response.json() as BackendResponse<T>;
    if (json.data !== undefined) {
      return json.data;
    }
    return json as unknown as T;
  },
};
