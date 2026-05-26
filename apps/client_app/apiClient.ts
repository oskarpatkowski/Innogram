import axios, { AxiosError, AxiosResponse } from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const data = error.response?.data as AxiosResponse["data"];

    const backendMessage = Array.isArray(data?.message)
      ? data.message.join(", ")
      : data?.message;
    const message =
      backendMessage ||
      data?.error ||
      error.message ||
      "An unexpected error occurred";

    console.error(`[API Error] ${error.config?.url}:`, message);

    if (error.response?.status === 401) {
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/auth")
      ) {
        window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent(
          window.location.pathname,
        )}`;
      }
    }

    return Promise.reject(new Error(message));
  },
);

export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
