/**
 * hooks/useAuth.ts
 * =================
 * React hook providing authentication state and operations across the app.
 */

import { useState, useEffect, useCallback } from "react";
import authService, { type UserProfile } from "@services/auth";

export interface UseAuthReturn {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const profile = await authService.getCurrentUser();
      setUser(profile);
    } catch {
      setUser(null);
      setError("Failed to verify authentication session.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  const login = useCallback(() => {
    const loginUrl = authService.getGoogleLoginUrl();
    window.location.href = loginUrl;
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch {
      setError("Failed to log out cleanly.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
  };
}

export default useAuth;
