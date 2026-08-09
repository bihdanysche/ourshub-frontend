import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export function getApiErrorCode(error: unknown): string | null {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: unknown } }).response;
    if (
      response?.data &&
      typeof response.data === "object" &&
      "error_code" in response.data
    ) {
      return (response.data as { error_code: string }).error_code;
    }
  }
  return null;
}

export function isUnauthorizedError(error: unknown): boolean {
  if (!error) return false;

  if (typeof error === "object") {
    const err = error as Record<string, any>;
    if (err.status === 401) return true;
    if (err.response?.status === 401) return true;
    if (err.statusCode === 401) return true;
    if (err.response?.data?.statusCode === 401) return true;
    if (err.response?.data?.status === 401) return true;
  }

  const code = getApiErrorCode(error);
  if (
    code === "UNAUTHORIZED" ||
    code === "REFRESH_TOKEN_REQUIRED" ||
    code === "SESSION_EXPIRED" ||
    code === "INVALID_ACCESS_TOKEN" ||
    code === "INVALID_REFRESH_TOKEN"
  ) {
    return true;
  }

  return false;
}

export const getErrorMessage = getApiErrorCode;

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/logout") ||
      originalRequest.url?.includes("/auth/telegram");

    // Only attempt token refresh if it's an access token expiration on a protected endpoint
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      const code = getApiErrorCode(error);

      // Do not attempt refresh if user has no tokens at all or refresh is not applicable
      if (
        code === "UNAUTHORIZED" ||
        code === "REFRESH_TOKEN_REQUIRED" ||
        code === "SESSION_EXPIRED" ||
        code === "INVALID_REFRESH_TOKEN"
      ) {
        return Promise.reject(error);
      }

      // If already refreshing, wait for in-flight refresh to complete
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post(
          "/auth/refresh",
          {},
          {
            _retry: true,
          } as CustomAxiosRequestConfig,
        );
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(error);
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
