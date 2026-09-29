/**
 * services/api.ts
 * ===============
 * Centralised Axios HTTP client for the Prompt2Form frontend.
 *
 * Rules:
 *  - This file is the ONLY place Axios is configured.
 *  - All other service files import `apiClient` from here.
 *  - The base URL is read exclusively from VITE_API_URL.
 *  - Never instantiate axios.create() anywhere else.
 */

import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiError } from "@/types";

// ------------------------------------------------------------------
// Base URL — sourced from environment variable only, never hardcoded
// ------------------------------------------------------------------
const BASE_URL = import.meta.env.VITE_API_URL as string;

if (!BASE_URL) {
  throw new Error(
    "[Prompt2Form] VITE_API_URL is not defined. Add it to your .env file.",
  );
}

// ------------------------------------------------------------------
// Client factory
// ------------------------------------------------------------------
function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 90_000,          // 90 s — Gemini + Google Forms API can take 20-30s
    withCredentials: true,    // Send HTTP-only session cookies
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // ---- Request interceptor ----------------------------------------
  // Attaches the Bearer token when present (Auth phase adds the token).
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: unknown) => Promise.reject(error),
  );

  // ---- Response interceptor ----------------------------------------
  // On success, unwrap the Axios wrapper so callers get response.data.
  // On error, normalise into an ApiError shape so callers never see
  // raw Axios internals.
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: unknown) => {
      const apiError = normaliseError(error);
      return Promise.reject(apiError);
    },
  );

  return client;
}

// ------------------------------------------------------------------
// Error normalisation — converts any thrown value into ApiError
// ------------------------------------------------------------------
function normaliseError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;

    // FastAPI returns { "detail": "..." } for HTTP errors
    if (responseData?.detail && typeof responseData.detail === "string") {
      return {
        code: `HTTP_${error.response?.status ?? "ERROR"}`,
        message: responseData.detail,
      };
    }

    // Structured error envelope { "error": { ... } }
    const serverError = responseData?.error;
    if (serverError && typeof serverError === "object") {
      return {
        code: (serverError as Record<string, unknown>).code as string ?? "API_ERROR",
        message: (serverError as Record<string, unknown>).message as string ?? "An API error occurred.",
        detail: (serverError as Record<string, unknown>).detail,
      };
    }

    // Network error or timeout — no response at all
    if (!error.response) {
      return {
        code: "NETWORK_ERROR",
        message: "Request timed out or server unreachable. Please try again.",
      };
    }

    // HTTP error without structured body
    return {
      code: `HTTP_${error.response.status}`,
      message: error.message ?? "An unexpected error occurred.",
    };
  }

  // Non-Axios error (programming errors, etc.)
  return {
    code: "UNKNOWN_ERROR",
    message:
      error instanceof Error ? error.message : "An unexpected error occurred.",
  };
}

// ------------------------------------------------------------------
// Singleton export
// ------------------------------------------------------------------
export const apiClient: AxiosInstance = createApiClient();

export default apiClient;
