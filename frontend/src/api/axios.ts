import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { getAccessToken, setTokens, clearTokens } from '../utils/token-service';
import type { AuthenticationResponse } from '../types/auth';
import type { ProblemDetail } from '../types/api';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface FailedQueueItem {
  resolve: (token: string | null) => void;
  reject: (error: Error | AxiosError) => void;
}

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (
  error: Error | AxiosError | null,
  token: string | null = null,
): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: any) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ProblemDetail>) => {
    const originalRequest = error.config as
      | CustomAxiosRequestConfig
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const errorCode = error.response?.data?.code;

    if (errorCode === 'INVALID_TOKEN' || errorCode === 'SESSION_DEAD') {
      console.warn(`[Auth Warning] Terminating session due to: ${errorCode}`);
      clearTokens();
      window.location.href = '/auth/login';
      return Promise.reject(error);
    }

    if (errorCode === 'TOKEN_EXPIRED' && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token) {
              originalRequest.headers.set('Authorization', `Bearer ${token}`);
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post<AuthenticationResponse>(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = response.data.accessToken;

        setTokens({ access: newAccessToken });
        originalRequest.headers.set(
          'Authorization',
          `Bearer ${newAccessToken}`,
        );

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        const err =
          refreshError instanceof Error
            ? refreshError
            : new Error('Refresh failed');
        processQueue(err, null);
        clearTokens();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
