import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig | undefined;
    const data = error.response?.data as AxiosResponse["data"];

    const isLoginRequest = originalRequest?.url?.includes('/auth/login');

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isLoginRequest) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = "Bearer " + token;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise(function (resolve, reject) {
        apiClient
          .post("/auth/refresh")
          .then(({ data }) => {
            processQueue(null, data.accessToken);
            resolve(apiClient(originalRequest));
          })
          .catch((err) => {
            processQueue(err instanceof Error ? err : new Error(String(err)), null);
            if (
              typeof window !== "undefined" &&
              !window.location.pathname.startsWith("/auth")
            ) {
              window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(
                window.location.pathname,
              )}`;
            }
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    const backendMessage = Array.isArray(data?.message)
      ? data.message.join(", ")
      : data?.message;
    const message =
      backendMessage ||
      data?.error ||
      error.message ||
      "An unexpected error occurred";

    console.error(`[API Error] ${error.config?.url}:`, message);

    return Promise.reject(new Error(message));
  },
);

export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
