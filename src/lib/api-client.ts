import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { ErrorResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://imaginemebylovie.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let tokenRefreshPromise: Promise<string> | null = null;

const refreshToken = async (): Promise<string> => {
  if (!tokenRefreshPromise) {
    tokenRefreshPromise = (async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post<{ token: string }>(
          `${API_BASE_URL}/api/auth/refresh`,
          { refreshToken }
        );

        const newToken = response.data.token;
        localStorage.setItem('authToken', newToken);
        return newToken;
      } finally {
        tokenRefreshPromise = null;
      }
    })();
  }

  return tokenRefreshPromise;
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        window.location.href = '/unauthorized';
      }
    }

    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export const isErrorResponse = (error: unknown): error is AxiosError<ErrorResponse> => {
  return axios.isAxiosError(error);
};

export const getErrorMessage = (error: unknown): string => {
  if (isErrorResponse(error)) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
};

export default apiClient;