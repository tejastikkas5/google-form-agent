/**
 * services/auth.ts
 * =================
 * Authentication service handling Google OAuth login, user profile fetching,
 * and session destruction.
 */

import apiClient from "./api";

export interface UserProfile {
  google_id: string;
  name: string;
  email: string;
  picture: string;
}

export interface AuthStatusResponse {
  authenticated: boolean;
  user: UserProfile | null;
  message?: string;
}

export interface LoginUrlResponse {
  url: string;
  state: string;
}

export const authService = {
  /**
   * Get the direct backend OAuth login endpoint URL.
   */
  getGoogleLoginUrl(): string {
    const rawBase = (import.meta.env.VITE_API_URL as string) || "";
    const cleanBase = rawBase.replace(/\/v1\/?$/, "").replace(/\/+$/, "");
    return `${cleanBase}/v1/auth/login`;
  },

  /**
   * Fetch current authenticated user profile.
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const response = await apiClient.get<AuthStatusResponse>("/v1/auth/me");
      if (response.data.authenticated && response.data.user) {
        return response.data.user;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Log out active user and clear session cookie.
   */
  async logout(): Promise<boolean> {
    try {
      await apiClient.post<AuthStatusResponse>("/v1/auth/logout");
      return true;
    } catch {
      return false;
    }
  },
};

export default authService;
