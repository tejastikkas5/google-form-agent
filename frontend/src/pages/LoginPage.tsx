/**
 * pages/LoginPage.tsx
 * ====================
 * Login page providing Google OAuth 2.0 sign in.
 * Matches existing dark theme, visual hierarchy, and error messaging.
 */

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Zap, ShieldCheck, Lock, Sparkles, AlertCircle } from "lucide-react";
import LoginButton from "@components/auth/LoginButton";
import useAuth from "@hooks/useAuth";

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "cancelled") {
      setErrorMessage("Authentication was cancelled. Click below to try again.");
    } else if (error === "missing_code" || error === "invalid_code" || error === "auth_failed") {
      setErrorMessage("Google authorization failed or expired. Please sign in again.");
    } else if (error === "server_error") {
      setErrorMessage("A backend server error occurred during authentication.");
    }
  }, [searchParams]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 px-4 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Main Login Card */}
        <div className="bg-[#0e0e1e]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center">
          {/* Brand Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-6">
            <Zap className="w-3.5 h-3.5 text-violet-400 fill-violet-400" />
            Prompt2Form Authentication
          </div>

          {/* Heading & Subtitle */}
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Welcome <span className="gradient-text">Back</span>
          </h1>
          <p className="mt-3 text-slate-400 text-sm leading-relaxed">
            Sign in with your Google account to access your Prompt2Form dashboard and workspace features.
          </p>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mt-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-left flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">Authentication Error</p>
                <p className="mt-0.5 opacity-90">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Login Button Container */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <LoginButton size="lg" className="w-full" />
          </div>

          {/* Security Features Reassurance */}
          <div className="mt-10 pt-6 border-t border-white/[0.08] grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400">
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>OAuth 2.0</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>HTTP-Only Session</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Google Verified</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-500 mt-6">
          By signing in, you agree to connect your Google profile securely.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
